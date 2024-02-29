// *** Servicio de Usuarios ***

// Imports principales
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";

// Imports del modelo Usuario
import { Product } from "../models/Product";

// Decorador
@Injectable()
export class ProductService {
    // Propiedades
    public url = global.url;  // Settear URL del backend

    constructor(
        private _http: HttpClient
    ){}

    // Obtener todos los usuarios
    all(): Observable<any> {
        return this._http.get(this.url+'product');
    }

    // Obtener un producto por el id
    one(id:string): Observable<any> {
        return this._http.get(this.url+'product/'+id);
    }

    // Obtener productos por tipo
    getProductsByType(type:string): Observable<any> {
        return this._http.get(this.url+'products-type/'+type);
    }

    // --- Guardar un producto nuevo (Mongo) ---
    save(product:Product, token:string): Observable<any> {
        let params = JSON.stringify(product); // Convertir
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.post(this.url+'product', params, { headers: headers });
    }

    // Actualizar la información de un producto
    update(product:Product, id:string, token:string): Observable<any> {
        let params = JSON.stringify(product); // Convertir
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.put(this.url+'product/'+id, params, { headers: headers });
    }

    // Buscar un producto por el nombre
    search(key:string): Observable<any> {
        return this._http.get(this.url+'products-name/'+key);
    }

    // Eliminar un producto con el id
    delete(id:string, type:string, token:string) : Observable<any> {
        let params = JSON.stringify({type: type});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.put(this.url+'product-type/'+id, params, { headers: headers });
    }
}