<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\product;

class ProductController extends Controller {

    public function __construct(){
        // Creating exception to actual methods that not use middleware
        $this->middleware('api.Authorization', ['except' => ['index', 'show', 'getProductsByType', 'searchProduct', 'getImage']]);
    }

    // (AUTO) List all products
    public function index() {
        $product = Product::all();

        return response()->json([
            'status' => 'success',
            'products' => $product
        ], 200);
    }

    // (AUTO) List one product
    public function show($id) {
        $product = Product::find($id);
        if(is_object($product)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'product' => $product
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'El producto no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // List by type
    public function getProductsByType($type) {
        $products = Product::where('type', '=', $type)->get();
        if(is_object($products)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'products' => $products
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'El producto no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // Search product
    public function searchProduct($key) {
        $products = Product::where('name', 'LIKE', '%'.$key.'%')->get();
        if(is_object($products)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'products' => $products
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'El producto no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // (AUTO) Save product
    public function store(Request $request) {
        // Recepción de datos
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        // Trimming Data
        $params_trim = array_map("trim", $params); 

        // Validación de los datos
        $validate = \Validator::make($params_trim, [
            'name' => 'required',
            'price' => 'required|numeric',
            'type' => 'required|alpha'
        ]);

        // Verificación de validación
        if($validate->fails()) {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Existen errores en la validación',
                'errors' => $validate->errors()
            );
        } else {
            // Definción de objeto Producto y setteo
            $product = new Product();
            $product->name = $params_trim['name'];
            $product->price = $params_trim['price'];
            $product->type = $params_trim['type'];
            $product->image = $params_trim['image'];
            // Guardar
            $product->save();

            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Producto guardado correctamente',
            );
        }

        return response()->json($response, $response['code']);
    }

    // (AUTO) Update product
    public function update(Request $request, $id) {
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        if(!empty($params)) {
            $params_trim = array_map('trim', $params);

            // Validar los datos
            $validate = \Validator::make($params_trim, [
                'name' => 'required',
                'price' => 'required|numeric',
                'type' => 'required|alpha'
            ]);
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Los datos enviados del producto no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // Quitar campos que no se actualizarán
                unset($params_trim['id']);
                unset($params_trim['created_at']);
                unset($params_trim['updated_at']);

                // Actualizar categoria
                $product_updated = Product::where('id', $id)->update($params_trim);

                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El producto se ha actualizado correctamente',
                    'table' => $product_updated
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Los datos del producto están vacios'
            );
        }
        return response()->json($response, $response['code']);
    }

    // (AUTO) Delete a product by a id
    public function destroy($id) {
        $product = Product::where('id', $id);
        if(is_object($product)) {
            // Eliminar el post
            $product->delete();

            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'El producto se ha eliminado correctamente'
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'El producto no existe'
            );
        }
        return response()->json($response, $response['code']);
    }

    // Upload image product
    public function upload(Request $request) {
        // Apply Middleware
        // Recoger archivo (nombre del archivo: 'file0')
        $image = $request->file('file0');
        // Image validation
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png'
        ]);
        // Verifing file uploated
        if($image && !$validate->fails()) {
            $image_name = time().$image->getClientOriginalName();  // Irrepetible name
            \Storage::disk('products')->put($image_name, \File::get($image));  // Save image in disk
            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => '¡La imagen del producto se ha subido correctamente!',
                'image' => $image_name
            );

        } else {
            $response = array(
                'status' => 'error',
                'code' => 400,
                'message' => '¡Archivo recibino no es válido o está vacio!'
            );
        }

        // Devolver una respuesta en texto plano
        //return response()->json($response, $response['code'])->header('Content-Type', 'text/plain');
        return response()->json($response, $response['code']);
    }

    // Get image
    public function getImage($filename) {
        $isset = \Storage::disk('products')->exists($filename);
        if($isset) {
            // Return image
            $file = \Storage::disk('products')->get($filename);
            return new Response($file, 200);
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'La imagen del producto no existe'
            );

            return response()->json($response, $response['code']);
        }
    }

    // 
}
