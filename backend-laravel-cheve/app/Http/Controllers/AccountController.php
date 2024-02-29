<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\account;
use App\order;
use App\User;
// Print Event
use App\Events\PrintEvent;

class AccountController extends Controller
{
    public function __construct(){
        // Creating exception to actual methods that not use middleware
        $this->middleware('api.Authorization', ['except' => ['index', 'show']]);
    }

    // (AUTO) List all accounts
    public function index() {
        $account = Account::all();

        return response()->json([
            'status' => 'success',
            'account' => $account
        ], 200);
    }

    // List today accounts (to Print)
    public function getTodayAccounts() {
        $today = date('y-m-d').'T00:00:00.000000Z';
        $accounts = Account::where('updated_at','>', $today)
                    ->where('status', '=', 'FINISHED')
                    ->orderBy('updated_at', 'DESC')
                    ->get()->load('table');

        foreach ($accounts as $account) {
            $account->hour_updated = $account->updated_at->format('H:i:s');
            $account->date_updated = $account->updated_at->format('Y-m-d');
            $orders = Order::where('account_id', '=', $account->id)
                ->get()->load('product');
            $account->orders = $orders;
        }

        return response()->json([
            'status' => 'success',
            'accounts' => $accounts
        ], 200);
    }

    // (AUTO) Get one account (inner Table)
    public function show($id) {
        $account = Account::find($id);
        if(is_object($account) && !is_null($account)) {
             $response = array(
                'status' => 'success',
                'code' => 200,
                'account' => $account
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'La cuenta no existe',
            );
        }
        return response()->json($response, $response['code']);
    }

    // Get table with account
    public function getAccountByTable($id) {
        $today = date('y-m-d').'T00:00:00.000000Z';

        $account = Account::where('table_id', '=', $id)
                    ->where('status', '=', 'ACTIVE')
                    ->where('updated_at','>', $today)
                    ->get();
        if(is_object($account) && !is_null($account)) {
             $response = array(
                'status' => 'success',
                'code' => 200,
                'account' => $account
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'No hay cuentas disponibles',
            );
        }
        return response()->json($response, $response['code']);
    }

    // Get products menu (joining)
    public function getMenuOrdersByUser($order_status) {
        $today = date('y-m-d').'T00:00:00.000000Z';
        // Get Users for PENDING
        if($order_status == 'PENDING') {
            $users = Account::join('users', 'accounts.user_id', 'users.id')
                ->join('tables', 'accounts.table_id', 'tables.id')
                ->where('accounts.updated_at', '>=', $today)
                ->where('accounts.status', 'ACTIVE')
                ->select('users.id AS user_id', 'accounts.id AS account_id', 'tables.id AS table_id', 'tables.table_name AS table', 'users.name', 'users.surname', 'accounts.updated_at')
                ->orderBy('accounts.updated_at', 'DESC')
                ->get();
            // Format time to hour
            foreach ($users as $user) {
                $user->hour_updated = $user->updated_at->format('H:i:s');
            }
        } else {
            $users = Account::join('users', 'accounts.user_id', 'users.id')
                ->join('tables', 'accounts.table_id', 'tables.id')
                ->where('accounts.updated_at', '>=', $today)
                ->select('users.id AS user_id', 'accounts.id AS account_id', 'tables.id AS table_id', 'tables.table_name AS table', 'users.name', 'users.surname', 'accounts.updated_at')
                ->orderBy('accounts.updated_at', 'DESC')
                ->get();
            // Format time to hour
            foreach ($users as $user) {
                $user->hour_updated = $user->updated_at->format('H:i:s');
            }
        }

        // Assign menu orders pending
        if($order_status == 'PENDING') {
            foreach ($users as $user) {
                 $accounts = Account::join('orders', 'accounts.id', 'orders.account_id')
                    ->join('products', 'orders.product_id', '=', 'products.id')
                    ->where('accounts.id', $user->account_id)
                    ->where([['accounts.status', 'ACTIVE'], ['orders.status', $order_status], ['products.type', 'MENU']])
                    ->select('products.name', 'orders.amount', 'orders.updated_at')
                    ->get();
                    // Format time to hour
                    foreach ($accounts as $account) {
                        $account->hour_updated = $account->updated_at->format('H:i:s');
                    }
                $user->orders_maked = $accounts;
            }
        } else {
            foreach ($users as $user) {
                 $accounts = Account::join('orders', 'accounts.id', 'orders.account_id')
                    ->join('products', 'orders.product_id', '=', 'products.id')
                    ->where('accounts.id', $user->account_id)
                    ->where([['orders.status', $order_status], ['products.type', 'MENU']])
                    ->select('products.name', 'orders.amount', 'orders.updated_at')
                    ->get();
                    // Format time to hour
                    foreach ($accounts as $account) {
                        $account->hour_updated = $account->updated_at->format('H:i:s');
                    }
                $user->orders_maked = $accounts;
            }
        }

        if(is_object($users)) {
             $response = array(
                'status' => 'success',
                'code' => 200,
                'users' => $users
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'No hay cuentas disponibles',
            );
        }
        return response()->json($response, $response['code']);
    }

    // Get products bar (joining)
    public function getBarOrdersByUser($order_status) { 
        $today = date('y-m-d').'T00:00:00.000000Z';
        // Get Users for PENDING
        if($order_status == 'PENDING') {
            $users = Account::join('users', 'accounts.user_id', 'users.id')
                ->join('tables', 'accounts.table_id', 'tables.id')
                ->where('accounts.updated_at', '>=', $today)
                ->where('accounts.status', 'ACTIVE')
                ->select('users.id AS user_id', 'accounts.id AS account_id', 'tables.id AS table_id', 'tables.table_name AS table', 'users.name', 'users.surname', 'accounts.updated_at')
                ->orderBy('accounts.updated_at', 'DESC')
                ->get();
            // Format time to hour
            foreach ($users as $user) {
                $user->hour_updated = $user->updated_at->format('H:i:s');
            }
        } else {
            $users = Account::join('users', 'accounts.user_id', 'users.id')
                ->join('tables', 'accounts.table_id', 'tables.id')
                ->where('accounts.updated_at', '>=', $today)
                ->select('users.id AS user_id', 'accounts.id AS account_id', 'tables.id AS table_id', 'tables.table_name AS table', 'users.name', 'users.surname', 'accounts.updated_at')
                ->orderBy('accounts.updated_at', 'DESC')
                ->get();
            // Format time to hour
            foreach ($users as $user) {
                $user->hour_updated = $user->updated_at->format('H:i:s');
            }
        }

        // Assign menu orders
        if($order_status == 'PENDING') {
            foreach ($users as $user) {
                 $accounts = Account::join('orders', 'accounts.id', 'orders.account_id')
                    ->join('products', 'orders.product_id', '=', 'products.id')
                    ->where('accounts.id', $user->account_id)
                    ->where([['accounts.status', 'ACTIVE'], ['orders.status', $order_status], ['products.type', 'BAR']])
                    ->select('products.name', 'orders.amount')
                    ->get();
                $user->orders_maked = $accounts;
            }
        } else {
            foreach ($users as $user) {
                 $accounts = Account::join('orders', 'accounts.id', 'orders.account_id')
                    ->join('products', 'orders.product_id', '=', 'products.id')
                    ->where('accounts.id', $user->account_id)
                    ->where([['orders.status', $order_status], ['products.type', 'BAR']])
                    ->select('products.name', 'orders.amount')
                    ->get();
                $user->orders_maked = $accounts;
            }
        }

        if(is_object($users)) {
             $response = array(
                'status' => 'success',
                'code' => 200,
                'users' => $users
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'No hay cuentas disponibles',
            );
        }
        return response()->json($response, $response['code']);
    }

    // (AUTO) Save Account
    public function store(Request $request) {
        // Recipe data : {"status":"ACTIVE", "pay_method":"CASH", "user_id":"7", "table_id":"5"}
        $json = $request->input('json', null);
        $params = json_decode($json, true);
        $params_trim = array_map("trim", $params); 

        // Validation
        $validate = \Validator::make($params_trim, [
            'status' => 'required|alpha',
            'pay_method' => 'required|alpha',
            'user_id' => 'required',
            'table_id' => 'required'
        ]);

        // Verification
        if($validate->fails()) {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Existen errores en la validación de la Cuenta',
                'errors' => $validate->errors()
            );
        } else {
            // Save account
            $account = new Account();
            $account->status = $params_trim['status'];
            $account->pay_method = $params_trim['pay_method'];
            $account->user_id = $params_trim['user_id'];
            $account->table_id = $params_trim['table_id'];
            $account->save();

            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Cuenta guardada correctamente',
                'account' => $account
            );
        }

        return response()->json($response, $response['code']);
    }

    // (AUTO) Update account
    public function update(Request $request, $id) {
        //Capture data
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        if(!empty($params)) {
            $params_trim = array_map('trim', $params);

            // Validar los datos
            $validate = \Validator::make($params_trim, [
                'status' => 'required|alpha',
                'pay_method' => 'required|alpha',
                'user_id' => 'required',
                'table_id' => 'required'
            ]);
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Los datos enviados de la cuenta no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // Quitar campos que no se actualizarán
                unset($params_trim['id']);
                unset($params_trim['created_at']);
                unset($params_trim['updated_at']);

                // Actualizar cuenta
                $account_updated = Account::where('id', $id)->update($params_trim);

                // Pucher Notification call event if account finished
                if($params_trim['status'] == 'FINISHED') {
                    event(new PrintEvent($account_updated));
                }

                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'La cuenta se ha actualizado correctamente',
                    'account' => $account_updated
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Los datos de la cuenta están vacios'
            );
        }
        return response()->json($response, $response['code']);
    }
}
