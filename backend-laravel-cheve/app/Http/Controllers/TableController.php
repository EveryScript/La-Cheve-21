<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\table;
// Waiter Event
use App\Events\WaiterEvent;

class TableController extends Controller
{
    public function __construct(){
        // Creating exception to actual methods that not use middleware
        $this->middleware('api.Authorization', ['except' => ['index', 'show', 'getAllAreas', 'showByArea']]);
    }

    // (AUTO) List all tables
    public function index() {
        $tables = Table::all();

        return response()->json([
            'status' => 'success',
            'tables' => $tables
        ], 200);
    }

    // (AUTO) List one table
    public function show($id) {
        $table = Table::find($id);
        if(is_object($table)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'table' => $table
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'La mesa no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // List all areas
    public function getAllAreas() {
        $areas = Table::select('area_name')->groupBy('area_name')->get();
        if(is_object($areas)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'areas' => $areas
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'No hay mesas ni areas registradas'
            );
        }

        return response()->json($response, $response['code']);
    }

    // List tables by area
    public function showByArea($area) {
        $table = Table::where('area_name', '=',$area)->get();
        if(is_object($table)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'tables' => $table
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'meessage' => 'La mesa no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // (AUTO) Save table
    public function store(Request $request) {
        // Capture data
        $json = $request->input('json', null);
        $params = json_decode($json, true);
        if(!empty($params)) {
            $params_trim = array_map('trim', $params);
            // Validation
            $validate = \Validator::make($params_trim, [
                'table_name' => 'required',
                'area_name' => 'required',
                'status' => 'required|alpha'
            ]);
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Existen errores en los datos de la mesa',
                    'errores' => $validate->errors()
                );
            } else {
                // Saving table
                $table = new Table();
                $table->table_name = $params_trim['table_name'];
                $table->area_name = $params_trim['area_name'];
                $table->status = $params_trim['status'];
                $table->save();
                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'La mesa ha sido guardada correctamente'
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Los datos enviados de la mesa son vacios o nulos',
                'errores' => $validate->errors()
            );
        }
        return response()->json($response, $response['code']);
    }

    // (AUTO) Update table
    public function update(Request $request, $id) {
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        if(!empty($params)) {
            $params_trim = array_map('trim', $params);

            // Validar los datos
            $validate = \Validator::make($params_trim, [
                'table_name' => 'required',
                'area_name' => 'required',
                'status' => 'required'
            ]);
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Los datos enviados de la mesa no son válidos',
                    'fails' => $validate->errors()
                );
            } else {
                // Quitar campos que no se actualizarán
                unset($params_trim['id']);
                unset($params_trim['created_at']);
                unset($params_trim['updated_at']);

                // Actualizar categoria
                $table_updated = Table::where('id', $id)->update($params_trim);

                // Pucher Notification call event if ready table
                if($params_trim['status'] == 'READY') {
                    event(new WaiterEvent($table_updated));
                }

                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'La mesa se ha actualizado correctamente',
                    'table' => $table_updated
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Los datos de la mesa están vacios'
            );
        }
        return response()->json($response, $response['code']);
    }
}
