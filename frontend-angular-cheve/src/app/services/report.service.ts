// *** Servicio de Reportes ***

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

@Injectable()
export class ReportService {
    // Propiedades
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url = global.url;
    }

    // Obtener los datos del reporte por meseros
    getReportForWaiters(start:string, end:string, token:string): Observable<any> {
        var params = JSON.stringify({ start: start, end: end });
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.post(this.url+'report-waiter-gains', params, { headers: headers });
    }

    // Obtener los datos del reporte por meseros
    getReportForProducts(id_user:string, start:string, end:string, token:string): Observable<any> {
      var params = JSON.stringify({ start: start, end: end });
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
      return this._http.post(this.url+'report-waiter-products/'+id_user, params, { headers: headers });
  }

    // Generar una tabla con jsPDF
    generatePdfToReport(object_pdf:any) {
        const doc = new jsPDF('p', 'mm', [216, 279]); // Papel Tamaño Carta Vertical
        const default_size = 10; // Tamaño de texto default
        // Añadir logo (imagen)
        const myImage = new Image();
        myImage.src = '../../../assets/img/icons/original.jpg';
        doc.addImage(myImage, 'png', 20, 10, 20, 20),
        // Elements on right
        autoTable(doc, {
          body: [ // Parametro body
            [ // Body element
              { // Object content
                content: 'La Paz '+moment().format('LL')+'\n Restaurante La Cheve 21'+'\n Zona San Miguel, Calle Cordero #8157'+'\n Contacto: 77219924',
                styles: {
                  halign: 'right',
                  fontSize: default_size-1,
                  textColor: '#444b55'
                }
              }
            ]
          ],
          theme: 'plain',
        });
    
        // Main title
        autoTable(doc, {
          margin: { top: 0 },
          bodyStyles: { font: '' },
          body: [ // Parametro body
            [ // Body element
              { // Object content
                content: object_pdf.title,
                styles: {
                  halign: 'center',
                  fontSize: 20,
                  textColor: '#40455e',
                  fontStyle: 'bold'
                }
              }
            ]
          ],
          theme: 'plain',
        });
    
        // Description
        autoTable(doc, {
          body: [ // Parametro body
            [ // Body element
              { // Object content
                content: 'Desde el '+ moment(object_pdf.start_date).format('Y-MM-DD H:mm') +' hasta el '+ moment(object_pdf.end_date).format('Y-MM-DD H:mm'),
                styles: {
                  fontSize: default_size,
                  textColor: '#444444',
                }
              },
              { // Object content
                content: 'Reporte generado por: '+ object_pdf.admin,
                styles: {
                  fontSize: default_size,
                  textColor: '#444444',
                }
              }
            ]
          ],
          theme: 'plain',
        });
    
        // Generando datos de la tabla via HTML
        //autoTable(doc, { html: table, theme: 'plain', styles: { fontSize: 9 } });
        
        // Generando datos de la tabla via array
        switch (object_pdf.type) {
          case 'gains':
            autoTable(doc, {
              head: [['Nombre del Mesero', 'Efectivo (Bs.)', 'Tarjeta (Bs.)', 'Total (Bs.)']],
              body: object_pdf.table,
              theme: 'plain', styles: { fontSize: 9 }
            });
          break;
          case 'products':
            autoTable(doc, {
              head: [['Mesero(a)', 'Ganancia efectivo', 'Ganancia tarjeta', 'Ganancia total']],
              body: object_pdf.table_resume,
              theme: 'plain', styles: { fontSize: 9 }
            });

            autoTable(doc, {
              head: [['Cantidad', 'Productos vendidos', 'Precio (Bs.)', 'Ganancia (Bs.)']],
              body: object_pdf.table,
              theme: 'plain', styles: { fontSize: 9 }
            });
          break;
        }
    
        // Playing Footer text
        autoTable(doc, {
          body: [
            [
              {
                content: "Este reporte ha sido generado por el sistema de Administración del Restaurante La Cheve 21, creado y diseñado por el Ing. Ever Quispe Ticona - Whatsapp: 67089424",
                styles: { halign: 'left', fontSize: default_size-1, textColor: '#5b5b5b' }
              }
            ]
          ]
        });
    
        doc.save('Report'+moment().format('x')+'.pdf');
    }

}