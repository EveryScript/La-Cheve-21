<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Importar para utilizar el Response
use Illuminate\Http\Response;
// Import Models
use App\User;
// Import JWT
use App\Helpers\JwtAuth;
// import Validator
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Login user
    public function login(Request $request) {
        // Define new JWT
        $jwtAuth = new JwtAuth();
        
        // Recipe data
        $json = $request->input('json', null);
        $params = json_decode($json, true);
        if(!empty($params)) {
            // Trimming
            $params_trim = array_map("trim", $params);
            // Validation
            $validate = Validator::make($params_trim, [
                'email' => 'required',
                'password' => 'required'
            ]);
            // Verifing validation
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Algunos datos del Login no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // Give me the token coded!
                $response = $jwtAuth->signUp($params_trim['email'], $params_trim['password']);
                if($params_trim['get_token']) {
                    $response = $jwtAuth->signUp($params_trim['email'], $params_trim['password'], true);
                }
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Error al recibir los datos de Login'
            );
        }
        return response()->json($response, 200);
    }

    // Save user
    public function save(Request $request) {
        // Recepción y decodificación
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        // Verificación 
        if(!empty($params)) {
            // Trimming
            $params_trim = array_map("trim", $params);

            // Validation
            $validate = Validator::make($params_trim, [
                'name' => 'required|alpha',
                'surname'=> 'required',
                'role' => 'required|alpha',
                'email' => 'required|email|unique:users',
                'password' => 'required'
            ]);

            // Verifing validation
            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Algunos datos del usuario no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // Crypting password
                $password_cifred = password_hash($params_trim['password'], PASSWORD_BCRYPT, ['cost' => 4]);

                $user = new User();
                $user->name = $params_trim['name'];
                $user->surname = $params_trim['surname'];
                $user->role = $params_trim['role'];
                $user->email = $params_trim['email'];
                $user->image = $params_trim['image'];
                $user->password = $password_cifred;
                // Saving user
                $user->save();  // First user: admin@admin.com  |   administrador

                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Usuario guardado correctamente',
                    'users' => $user
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Ha ocurrido un error al obtener los datos de usuario'
            );
        }

        return response()->json($response, $response['code']);
    }

    // List all users
    public function all(){
        $users = User::select('id', 'name', 'surname', 'role', 'email', 'created_at', 'updated_at')->get();
        //$users = User::all();

        // Format time to hour
        foreach ($users as $user) {
            $user->hour_created = $user->created_at->format('H:i:s');
            $user->hour_updated = $user->updated_at->format('H:i:s');
        }

        $response = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Usuarios encontrados',
            'users' => $users
        );

        return response()->json($response, $response['code']);
    }

    // List user by id
    public function user($id){
        $user = User::find($id);

        if(is_object($user)) {
            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Usuarios encontrados',
                'user' => $user
            );
        } else {
            $response = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'El usuario no existe'
            );
        }

        return response()->json($response, $response['code']);
    }

    // Upload avatar
    /*public function uploadAvatar(Request $request) {
        // Apply Middleware
        // Recoger archivo (nombre del archivo: 'file0')
        $image = $request->file('file0');
        // Image validation
        $validate = Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png'
        ]);
        // Verifing file uploated
        if($image && !$validate->fails()) {
            $image_name = time().$image->getClientOriginalName();  // Irrepetible name
            \Storage::disk('avatars')->put($image_name, \File::get($image));  // Save image in disk
            $response = array(
                'status' => 'success',
                'code' => 200,
                'message' => '¡La imagen se ha subido correctamente!',
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
    }*/

    // Get avatar by id
    /*public function getAvatar($filename) {
        $isset = \Storage::disk('avatars')->exists($filename);
        if($isset) {
            // Return image
            $file = \Storage::disk('avatars')->get($filename);
            return new Response($file, 200);
        } else {
            $response = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'La imagen no existe'
            );

            return response()->json($response, $response['code']);
        }
    }*/ 

    // Update user
    public function update(Request $request){
        // Recipe token
        $token = $request->header('Authorization', null);
        // Verifing token login
        $jwt_auth = new JwtAuth();
        $check_token = $jwt_auth->checkToken($token);
        // Recipe data
        $json = $request->input('json', null);
        $params = json_decode($json, true);

        if($check_token && !empty($params)) {
            // Trimming
            $params_trim = array_map('trim', $params);
            $user_checked = $jwt_auth->checkToken($token, true); 

            $validate = Validator::make($params_trim, [
                'name' => 'required|alpha',
                'surname' => 'required',
                'role' => 'required|alpha',
                'email' => 'required|email|unique:users,id,'.$user_checked->sub
            ]);

            if($validate->fails()) {
                $response = array(
                    'status' => 'error',
                    'code' => 500,
                    'message' => 'Los datos para actualizar al usuario no son válidos',
                    'errors' => $validate->errors()
                );
            } else {
                // Unsetting parameters 
                //unset($params_trim['id']);
                unset($params_trim['password']);
                unset($params_trim['created_at']);
                unset($params_trim['updated_at']);
                unset($params_trim['remember_token']);
                unset($params_trim['get_token']);
                // Updating where id is same
                //$user_updated = User::where('id', $user_checked->sub)->update($params_trim);
                $user_updated = User::where('id', $params_trim['id'])->update($params_trim);
                $response = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha actualizado correctamente',
                    'user' => $params_trim
                );
            }
        } else {
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'El usuario no está identificado'
            );
        }
        return response()->json($response, $response['code']);
    }
}
    