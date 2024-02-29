/* *** Servicio de Cuentas *** */

// Imports principales
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
// Importing moment.js
import * as moment from 'moment'; moment.locale("es"); 
// Generate pdf with jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import del modelo
import { Account } from "../models/Account";
import { discardPeriodicTasks } from "@angular/core/testing";

// Decorador
@Injectable()
export class AccountService {
    //Propiedades 
    public url = global.url;

    constructor(
        private _http: HttpClient
    ){
    }

    // Obtener todas las cuentas finalizadas para imprimir
    getAccountsByStatus(status:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'account-status/'+status, { headers: headers });
    }

    // Obtener todas las cuentas y las ordenes
    getAllAccountsOrders(hours:string, token:string):Observable<any> {
      let headers = new HttpHeaders().set('Authorization', token);
      return this._http.get(this.url+'accounts-control/'+hours, { headers: headers });
    }
    
    // Obtener una cuenta (si existe) por el id de mesa
    getAccountByIdTable(id_table:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'account-table/'+id_table, { headers: headers });
    }

    // Obtener una cuenta por el id
    one(id_account:string, token:string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url+'account/'+id_account, { headers: headers });
    }

    // Crear una nueva cuenta
    save(account:Account, token:string): Observable<any> {
        let params = JSON.stringify(account);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.post(this.url+'account', params, { headers: headers });
    }

    // Actualizar cuenta
    update(id_account:string, account:Account, token:string): Observable<any> {
        let json = JSON.stringify(account);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);
        return this._http.put(this.url+'account/'+id_account, params, { headers: headers });
    }

    // Actualizar solo metodo de pago
    updatePayMethod(id:string, pay_method:string, token:string): Observable<any> {
        let params = JSON.stringify({method: pay_method});
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.put(this.url+'account-method/'+id, params, { headers: headers });
    }

    // Actualizar solo estado (finalizar)
    updateStatusAccount(id:string, status:string, token:string): Observable<any> {
      let params = JSON.stringify({status: status});
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);
      return this._http.put(this.url+'account-status/'+id, params, { headers: headers });
    }

    // Generar PDF para la cuenta (Ticket)
    generateAccountTicket(table: any, pay_method:string) {
        const doc = new jsPDF('p', 'mm', [86, 220]); // Papel Tamaño Carta Vertical
        const default_size = 10; // Tamaño de texto default
        // Añadir logo (imagen)
        const myImage = new Image();
        myImage.src = '../../../assets/img/icons/main-black.png';
        doc.addImage(myImage, 'png', 27, 0, 30, 20),

        autoTable(doc, {
          body: [ // Parametro body
            [ // Body element
              { // Object content
                content: '\n \n \n La Paz '+moment().format('LLL')+'\n Zona San Miguel, Calle Cordero #8157'+'\n Contacto: 77219924 \n \n Metodo de pago: '+pay_method,
                styles: {
                  halign: 'center',
                  fontSize: default_size-2,
                  textColor: '#000000'
                }
              }
            ]
          ],
          theme: 'plain',
        });
    
        // Generando datos de la tabla
        autoTable(doc, { html: table, theme: 'plain', margin: 0, styles: { textColor: '#000000', fontSize: 9, cellWidth: 50, minCellHeight: 0, cellPadding: 1 } });
    
        // Playing Footer text
        autoTable(doc, {
          body: [
            [
              {
                content: "COMIDA, BEBIDA Y DIVERSIÓN AL MISMO PRECIO",
                styles: { halign: 'center', fontSize: default_size-1, textColor: '#000000' }
              }
            ]
          ]
        });
        doc.save('Cuenta'+moment().format('x')+'.pdf');
    }

    // Transferir mesas de una cuenta
    updateTransferAccount(id:string, id_table_actual:string, id_table_new:string, token:string): Observable<any> {
      let params = JSON.stringify({id_actual_table: id_table_actual, id_new_table: id_table_new});
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);
      return this._http.put(this.url+'account-transfer/'+id, params, { headers: headers });
    }
}