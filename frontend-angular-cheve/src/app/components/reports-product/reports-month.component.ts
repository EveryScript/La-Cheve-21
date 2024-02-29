import { Component, OnInit } from '@angular/core';
// Imports principales
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
moment.locale("es"); // Importing moment.js
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-reports-month',
  templateUrl: './reports-month.component.html',
  styleUrls: ['./reports-month.component.css'],
  providers: [UserService, ReportService]
})
export class ReportsMonthComponent implements OnInit {
  // Propiedades
  public today = moment().format('Y-MM-D');
  public user_logged = this._userService.getUserLogged();
  public token = this._userService.getToken();
  public loading_flag = false;
  public start_date: any;
  public end_date: any;
  public waiters: any;
  public notifier: any;
  // Arrays of results
  public orders: any;
  public waiter: any;
  public waiter_result: any;

  constructor(
    private _userService: UserService,
    private _reportService: ReportService
  ){
    this.notifier = new AWN(); // Notificador Awesome
  }

  ngOnInit(): void {
    // Cargar todos los usuarios
    this._userService.usersByRole('WAITER').subscribe(
      response => {
        if(response.status == 'success') {
          this.waiters = response.users;
        }
      }, error  => {
        console.log(<any>error);
      }
    );
  }

  // Agregar un id al array de meseros
  btnSelectWaiter(id:any) {
    this._userService.user(id).subscribe(
      response => {
        if(response.status == 'success') {
          this.waiter = response.user;
        }
      }, error  => {
        console.log(<any>error);
      }
    );
  }

  // Boton enviar fechas para generar reporte
  btnSendToReport() {
    //let end_date_add = moment(this.end_date).add(1, 'days').format('Y-MM-DD');  // Add one day (end date) to query
    this.loading_flag = true;
    if(this.waiter) {
      this._reportService.getReportForProducts(this.waiter, this.start_date, this.end_date, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            var orders = this.groupOrdersByProduct(response.orders);
            this.waiter_result = {
              name: response.waiter.name,
              surname: response.waiter.surname,
              orders: orders,
              total_cash: response.total_cash,
              total_card: response.total_card,
              total_gain: response.total_gain
            };
            if(this.user_logged.role == 'MAIN') {
              this.btnGeneratePdf();
            }
            this.loading_flag = false;
          }
        }, error  => {
          console.log(<any>error);
        }
      );
    } else { this.notifier.warning("No hay resultados para mostrar"); }
  }

  // Agrupar los productos
  groupOrdersByProduct(orders: any) {
    var array_orders = new Array();
    orders.forEach((order: any) => {
      if (array_orders.length == 0) {
        array_orders.push({ id: order.id, amount: order.amount.toString(), name: order.name, price: order.price });
      } else {
        var flag = true;
        var id_product = order.id;
        // Aumentar la cantidad
        array_orders.map(function (element: any) {
          if (element.id == id_product) {
            var amount_number = Number(element.amount);
            amount_number += Number(order.amount);
            element.amount = amount_number.toString();
            flag = false;
          }
          return element;
        });
        if (flag) {
          array_orders.push({ id: order.id, amount: order.amount.toString(), name: order.name, price: order.price });
        }
      }
    });
    return array_orders;
  }

  // Generar pdf con el servicio de reportes
  btnGeneratePdf() {
    let products_table = new Array();
    this.waiter_result.orders.forEach((product:any) => {
      products_table.push([ product.amount, product.name, product.price, parseInt(product.amount)*parseInt(product.price) ]);
    });

    let object_pdf = {
      type: 'products',
      title: 'Reporte de productos por mesero',
      admin: this.user_logged.name + " " + this.user_logged.surname,
      start_date: this.start_date,
      end_date: this.end_date,
      table_resume: [
        [
          this.waiter_result.name+' '+this.waiter_result.surname,
          this.waiter_result.total_cash.toString()+' Bs.',
          this.waiter_result.total_card.toString()+' Bs.',
          this.waiter_result.total_gain.toString()+' Bs.'
        ]
      ], 
      table: products_table
    };
    this._reportService.generatePdfToReport(object_pdf);
  }
  
  // Convert date to text
  dateToText(date:string) {
    let date_format = moment(date).format('Y-MM-DD H:mm');
    let month = "";
    switch (date.substring(5, 7)) {
      case "01": month = "enero"; break;
      case "02": month = "febrero"; break;
      case "03": month = "marzo"; break;
      case "04": month = "abril"; break;
      case "05": month = "mayo"; break;
      case "06": month = "junio"; break;
      case "07": month = "julio"; break;
      case "08": month = "agosto"; break;
      case "09": month = "septiembre"; break;
      case "10": month = "octubre"; break;
      case "11": month = "noviembre"; break;
      case "12": month = "diciembre"; break;
    }
    return date_format;
    //return date.substring(8, 10)+" de "+month;
  }
}
