/* *** Servicio de Ordenes *** */

// Imports principales
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";

// Decorador
@Injectable()
export class OrderService {
    //Propiedades 
    public url = global.url;

    constructor(
        private _http: HttpClient
    ){
    }

    // Obtener las ordenes de una cuenta
    getOrdersByIdAccount(id_account:number, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'order/get-by-account/'+id_account, { headers: headers });
    }

    // Obtener las ordenes de una mesa (si existen) con la el estado de la cuenta
    getOrdersByIdTable(id_table:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'orders-table/'+id_table, { headers: headers });
    }

    // Obtener todas las ordenes del menu de cada mesero
    getMenuOrdersByUser(status:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'menu-orders/'+status, { headers: headers });
    }

    // Obtener todas las ordenes del bar de cada mesero
    getBarOrdersByUser(status:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'bar-orders/'+status, { headers: headers });
    }

    // Guardar todas las ordenes
    save(id_account:string, table_status:any, orders:any, token:string): Observable<any> {
        let params = JSON.stringify({orders: orders, status_table:table_status});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(this.url+'orders/'+id_account, params, { headers: headers });
    }

    // Actualizar las ordenes del menu segun el id de cuenta y el tipo de producto (y estado de la mesa)
    updateMenuOrders(account_id:string, status_order:string, status_table:string, token:string): Observable<any> {
        let params = JSON.stringify({   status_order: status_order,
                                        status_table: status_table
                                    });
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.put(this.url+'menu-orders-account/'+account_id, params, { headers: headers });
    }
    // Actualizar las ordenes del menu segun el id de cuenta y el tipo de producto
    updateNotifications(request:object, token:string): Observable<any> {
        let params = JSON.stringify({...request});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(`${this.url}read-notifications`, params, { headers: headers });
    }
    // Actualizar las ordenes del BAR segun el id de cuenta y el tipo de producto
    updateBarOrders(account_id:string, status_order:any, status_table:any, token:string): Observable<any> {
        let params = JSON.stringify({   status_order: status_order,
                                        status_table: status_table
                                    });
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.put(this.url+'bar-orders-account/'+account_id, params, { headers: headers });
    }

    // Actualizar todas las ordenes de una cuenta (ACTIVE o FINISHED)
    updateAlllOrders(account_id:string, status:string, token:string): Observable<any> {
        let params = JSON.stringify({status: status});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.put(this.url+'all-orders-account/'+account_id, params, { headers: headers });
    }

    // (N U E V O)
    // Eliminar un pedido especifico
    deleteSpecificOrder(account_id:string, product_id:string, created_at:string, token:string): Observable<any> {
        let params = JSON.stringify({account_id: account_id, product_id:product_id, created_at:created_at});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.put(this.url+'delete-order', params, { headers: headers });
    }
}