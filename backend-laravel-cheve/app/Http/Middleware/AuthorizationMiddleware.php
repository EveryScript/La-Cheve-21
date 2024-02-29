<?php

namespace App\Http\Middleware;

use Closure;

class AuthorizationMiddleware
{
    // Middleware verify token
    public function handle($request, Closure $next) {
        // Recipe header 'Authorization'
        $token = $request->header('Authorization', null);
        
        // Verifing token
        $jwt_auth = new \JwtAuth();
        $check_token = $jwt_auth->checkToken($token);
        if($check_token) {
            // Continue process
            return $next($request);
        } else {
            // Send error and stop
            $response = array(
                'status' => 'error',
                'code' => 500,
                'message' => 'Error al autenticar al usuario desde el Middleware'
            );

            return response()->json($response, $response['code']);
        }
    }
}
