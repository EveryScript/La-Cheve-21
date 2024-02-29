/* *** Servicio de Mesas *** */

// Imports principales
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";

// Import del modelo
import { Table } from "../models/Table";

// Decorador
@Injectable()
export class TableService {
    // Propiedades
    public url = global.url;

    constructor(
        private _http: HttpClient
    ){}

    // Obtener todas las mesas
    all(): Observable<any> {
        return this._http.get(this.url+'tables');
    }

    // Obtener las mesas por estado
    allByStatus(status:string): Observable<any> {
        return this._http.get(this.url+'tables-status/'+status);
    }

    // Obtener todas las áreas de las mesas
    allAreas(): Observable<any> {
        return this._http.get(this.url+'areas-table');
    }

     // Obtener todas las áreas de las mesas
    allAreas2(user_id:any): Observable<any> {
        //console.warn(user_id)
        return this._http.get(this.url+'areas/'+user_id);
    }

    // Obtener las mesas por area
    allByArea(area:string): Observable<any> {
        return this._http.get(this.url+'table-area/'+area);
    }

    // Obtener una mesa por el id
    one(id:string): Observable<any> {
        return this._http.get(this.url+'table/'+id);
    }

    // Obtener una mesa por el id y solcitar datos
    oneAndOptions(id:string): Observable<any> {
        return this._http.get(this.url+'table-options/'+id);
    }

    // Guardar una nueva mesa
    save(table:Table, token:string): Observable<any> {
        let params = JSON.stringify(table);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.post(this.url+'table', params, { headers: headers });
    }

    // Actualizar datos de una mesa
    update(id:string, table:Table, token:string): Observable<any> {
        let params = JSON.stringify(table);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.put(this.url+'table/'+id, params, { headers: headers });
    }

    // Actualizar solo estado de la mesa
    updateStatus(id:string, status:string, token:string): Observable<any> {
        let params = JSON.stringify({status: status});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.put(this.url+'table-status/'+id, params, { headers: headers });
    }

    // Actualizar las notificaciones no leidas a leidas
    updateNotifications(request:object, token:string): Observable<any> {
        let params = JSON.stringify({...request});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(`${this.url}read-notifications`, params, { headers: headers });
    }

    // Eliminar mesa
    delete(id:string, status:string, token:string): Observable<any> {
        let params = JSON.stringify({status: status});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.put(this.url+'table-status/'+id, params, { headers: headers });
    }
}