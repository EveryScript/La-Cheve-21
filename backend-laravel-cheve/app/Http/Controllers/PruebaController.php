<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PruebaController extends Controller
{
    // Metodo de prueba hacia una vista
    public function prueba() {
        $titulo = 'Titulo desde PruebaController';

        return view('welcome', array(
            'titulo' => $titulo
        ));
    }

    // Metodo de prueba de envio y recepción de datos
    public function devolver_datos(Request $request) {
        // Recepción de datos y decodificación
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        // Validación
        $validate = \Validator::make($params, [
            'nombre' => 'required|alpha',
            'apellido' => 'required|alpha',
            'edad' => 'required|numeric',
            'email' => 'required|email'
        ]);

        // Verificación de validación
        if($validate->fails()) {
            $response = array(
                'status' => 'error',  
                'code' => 500,
                'message' => 'La validación muestra errores',
                'errors' => $validate->errors()
            );
        } else {
            $response = array(
                'status' => 'success',  
                'code' => 200,
                'message' => 'Usuario recibido con éxito',
                'user' => $params
            );
        }

        return response()->json($response, $response['code']);
    }
}
