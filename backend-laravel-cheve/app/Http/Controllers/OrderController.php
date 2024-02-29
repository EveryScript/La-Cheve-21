<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\order;
use App\account;
use App\Events\CookEvent;     // Use of Pusher Event to Cook
use App\Events\BarEvent;     // Use of Pusher Event to Bar

class OrderController extends Controller
{
    //use ExampleTrait;   // Enable Trait

    public function __construct(){
        // Creating exception to actual methods that not use middleware
        $this->middleware('api.Authorization', ['except' => ['index', 'show']]);
    }

    // (AUTO) List all products
    public function index() {
        $order = Order::all();

        return response()->json([
            'status' => 'success',
            'order' => $order
        ], 200); 
    }

    // List orders by account
    public function showByAccount($id) {
        $orders = Order::where('account_id', '=', $id)->get()->load('product');

        // Format time to hour
        $total_price = 0;
        $date_created = '';
        foreach ($orders as $order) {
            $total_price += $order->amount * $order->product->price;
            $order->hour_created = $order->created_at->format('H:i:s');
            $order->hour_updated = $order->updated_at->format('H:i:s');
            $date_created = $order->created_at->format('Y-m-d');
        }
        

        if(is_object($order)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'total_price' => $total_price,
                'date_created' => $date_created,
                'orders' => $orders
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'Ha ocurrido un error al enviar las ordenes'
            );
        }

        return response()->json($response, $response['code']);
    }

    // List orders by table
    public function showByTable($id, $status) {
        // Setting current date
        $today = date('y-m-d').'T00:00:00.000000Z';

        if($status == "ANY") {
            $order = Order::join('accounts', 'orders.account_id', 'accounts.id')
                            ->join('tables', 'accounts.table_id', 'tables.id')
                            ->where('accounts.table_id', $id)
                            ->where('accounts.status', 'ACTIVE')
                            ->orWhere('accounts.status', 'FINISHED')
                            ->where('orders.updated_at','>', $today)
                            ->select('orders.product_id','orders.status', 'orders.amount', 'tables.table_name', 'orders.updated_at')
                            ->get()
                            ->load('product');    
        } else {
            $order = Order::join('accounts', 'orders.account_id', 'accounts.id')
                        ->join('tables', 'accounts.table_id', 'tables.id')
                        ->where('accounts.table_id', $id)
                        ->where('accounts.status', $status)
                        ->where('orders.updated_at','>', $today)
                        ->select('orders.product_id','orders.status', 'orders.amount', 'tables.table_name', 'orders.created_at', 'orders.updated_at')
                        ->get()
                        ->load('product');
        }

        $total_price = 0;
        foreach ($order as $single) {
            $price = $single->product->price;
            $amount = $single->amount;
            $total_price += ($price * $amount);
            $single->hour_created = $single->created_at->format('H:i:s');   // format hour updated
            $single->hour_updated = $single->updated_at->format('H:i:s');   // format hour updated
        }
        
        if(is_object($order)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'total_price' => $total_price,
                'orders' => $order
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'Ha ocurrido un error al enviar las ordenes'
            );
        }

        return response()->json($response, $response['code']);
    } 

    // Update order by account_id
    public function updateOrder(Request $request, $id, $type) {
        //Capture data
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        if(!empty($params)) {
            $params_trim = array_map('trim', $params);

            // Validation
            $validate = \Validator::make($params_trim, [
                'status' => 'required|alpha',
            ]);
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Los datos enviados de la cuenta no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // remove innecesary fields
                unset($params_trim['id']);
                unset($params_trim['amount']);
                unset($params_trim['created_at']);

                // Actualizar categoria
                $order_updated = Order::join('products', 'orders.product_id', 'products.id')
                    ->where('orders.account_id', $id)
                    ->where('orders.status', 'PENDING')
                    ->where('products.type', $type)
                    ->select('orders.status')
                    ->update($params_trim);

                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'La orden se ha actualizado correctamente',
                    'table' => $order_updated
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Los datos de la orden están vacios'
            );
        }
        return response()->json($response, $response['code']);
    }

    // (AUTO) Save orders
    public function store(Request $request) {
        $json = $request->input('json', null);
        $params = json_decode($json, true);
        // Reading each data
        $counter_verify = 0;
        foreach ($params as $param) {
            //$params_trim = array_map("trim", $param);

            // Validación de los datos
            $validate = \Validator::make($param, [
                'account_id' => 'required',
                'product_id' => 'required',
                'amount' => 'required|numeric',
                'status' => 'required|alpha'
            ]);

            // Verification
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Existen errores en la validación de la Orden',
                    'errors' => $validate->errors()
                );
                return response()->json($response, $response['code']);
            } else {
                // Save order
                $order = new Order();
                $order->account_id = $param['account_id'];
                $order->product_id = $param['product_id'];
                $order->amount = $param['amount'];
                $order->status = $param['status'];
                $order->save();
                $counter_verify++;
            }
        } // End foreach

        // Pucher Notification call event
        event(new CookEvent($params));
        event(new BarEvent($params));

        // Verification all saved
        if(count($params) == $counter_verify) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Pedidos guardados correctamente',
            );
        }

        return response()->json($response, $response['code']);
    }
}
