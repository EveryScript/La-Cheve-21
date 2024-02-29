<?php
	namespace App\Helpers;
	use Firebase\JWT\JWT;				// <-- Importar libreria JWT
	use Firebase\JWT\Key;				// <-- Importar key
	use Illuminate\Support\Facades\DB;	// <-- Importar libreria de Base de Datos (Laravel)
	use App\User;						// <-- Importar el modelo de Usuarios

	class JwtAuth {
		public $secret_key;

		public function __construct() {
			// Genering secret and unique key
			$this->secret_key = 'esta_es_mi_clave_super_secreta_56964';
		}

		// Login for users
		public function signUp($email, $password, $getToken = false) {
			// Find the user
			$user = User::where([ 'email' => $email ])->first();

			// Check crypt password autentication
			$sign = false;
			if(is_object($user)) {
				$password_flag = password_verify($password, $user->password);
				if($password_flag && $user->role != 'DELETED') {
					$sign = true;
				}
			}

			// Define token content
			if($sign) {
				$token = array(
					'sub' => $user->id,		// Id de usuario (sub)
					'email' => $user->email,
					'name' => $user->name,
					'surname' => $user->surname,
					'role' => $user->role,
					'image' => $user->image,
					'iat' => time(),		// Tiempo de inicio válido del token
					'exp' => time() + (7 * 24 * 60 * 60)	// Expiracion del token en una semana (D*H*Min*Seg)
				);

				// Genering token with algorithm HS256
				$token_code = JWT::encode($token, $this->secret_key, 'HS256');
				// Genering token uncoded
				$token_decode = JWT::decode($token_code, new key($this->secret_key, 'HS256'));
				
				// Rection to $getToken
				if($getToken) {
					$response = $token_decode;
				} else {
					$response = $token_code;
				}
			} else {
				// Incorrect login
				$response = array(
					'status' => 'error',
					'code' => 500,
					'message' => 'Login incorrecto'
				);
			}
			return $response;
		}

		// Verifing token autenticity
		public function checkToken($jwt, $get_identity = false) {
			$auth = false;
			// Decodification (danger)
			try {
				$jwt_clear = str_replace('"', '', $jwt);
				$decode = JWT::decode($jwt_clear, new key ($this->secret_key, 'HS256'));
			} catch(\UnexpectedValueException $e) {
				$auth = false;
			} catch(\DomainException $e) {
				$auth = false;
			}

			// Correct?
			if(!empty($decode) && is_object($decode) && isset($decode->sub)) {
				$auth = true;
			} else {
				$auth = false;
			}
			$response = $auth;

			// Assign data decoded
			if($get_identity) {
				$response = $decode;
			}

			return $response;
		}
	}
?>