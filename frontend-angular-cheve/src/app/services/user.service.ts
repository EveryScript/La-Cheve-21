// *** Servicio de Usuarios ***

// Imports principales
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";

// Imports del modelo Usuario
import { User } from "../models/User";

// Decorador
@Injectable()
export class UserService {
    // Propiedades
    public url: string;
    public user_logged: any;
    public token: any;

    constructor(
        private _http: HttpClient
    ){
        this.url = global.url;  // Settear URL del backend
    }

    // --- Login de usuarios ---
    signUp(user:User): Observable<any> {
        if(user.get_token != '') {
            user.get_token = 'true';
        }

        let params = JSON.stringify(user);    // Convertir
        let headers = new HttpHeaders().set('Content-Type', 'application/json');//; // Cabecear :)
                                        //.set('X-Requested-With', 'XMLHttpRequest')
                                        //.set('X-CSRF-TOKEN', ''); //
        return this._http.post(this.url+'login', params, { headers: headers });  // Enviar
    }



    // Obtener todos los usuarios
    all(): Observable<any> {
        return this._http.get(this.url+'users');
    }

    // Obtener un usuario por el id
    user(id:string): Observable<any> {
        return this._http.get(this.url+'user/'+id);
    }

    // Obtener un usuario por el rol
    usersByRole(role:string): Observable<any> {
        return this._http.get(this.url+'users-role/'+role);
    }

    // Obtener información de usuario (logueado)
    getUserLogged() {
        let logged = localStorage.getItem('user_logged');
        if(logged && logged!= "undefined") {
            this.user_logged = JSON.parse(logged);
        } else {
            this.user_logged = false;
        }

        return this.user_logged;
    }
    
    // Obtener el token de usuario (logueado)
    getToken() {
        let token = localStorage.getItem('token');
        if(token && token != "undefined") {
            this.token = token;
        } else {
            this.token = false;
        }

        return this.token;
    }

    // Actualizar información de un usuario
    update(user:User, token:string): Observable<any> {
        let params = JSON.stringify(user);    // Convertir
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token); // Cabecear :)
        return this._http.put(this.url+'user/'+user.id, params, { headers: headers });  // Enviar
    }

    // Actualizar información de un usuario
    unable(id:string, role:string, token:string): Observable<any> {
        let params = JSON.stringify({ role: role });  
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token); // Cabecear :)
        return this._http.put(this.url+'unable-user/'+id, params, { headers: headers });  // Enviar
    }

    // --- Guardar un nuevo usuario (Mongo) ---
    save(user:User, token:string): Observable<any> {
        let params = JSON.stringify(user);    // Convertir
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token); // Cabecear :); // Cabecear :)
        return this._http.post(this.url+'user', params, { headers: headers });  // Enviar
    }
}