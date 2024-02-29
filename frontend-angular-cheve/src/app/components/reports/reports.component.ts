import { Component, OnInit } from '@angular/core';
// Imports principales
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment'; moment.locale("es"); // Importing moment.js
// Generate pdf with jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [UserService, ReportService]
})
export class ReportsComponent implements OnInit {
  // Propiedades
  public start_date: any;
  public end_date: any;
  public today = moment().format('Y-MM-DD');
  public report_today = moment().format('D - MMMM - YYYY');
  public token = this._userService.getToken();
  public user_logged = this._userService.getUserLogged();
  public notifier = new AWN(); // Notificador Awesome
  public loading_flag = false;
  // Array of results and totals
  public array_waiters: any;
  public total_cash = 0;
  public total_card = 0;
  public total_general = 0;

  constructor(
    private _userService: UserService,
    private _reportService: ReportService
  ) {
  }

  ngOnInit(): void { }

  // Generar el pdf con el servicio de Reportes
  //btnGeneratePdf(table: any) {
  btnGeneratePdf() {
    let waiters_table = new Array();
    this.array_waiters.forEach((waiter:any) => {
      waiters_table.push([ waiter.waiter_name, waiter.total_cash.toString(), waiter.total_card.toString(), waiter.total_gains.toString() ]);
    });
    waiters_table.push([ 'TOTAL', this.total_cash.toString(), this.total_card.toString(), this.total_general.toString() ]);
    let object_pdf = {
      type: 'gains',
      title: 'Reporte de ganancias por mesero',
      admin: this.user_logged.name + " " + this.user_logged.surname,
      start_date: this.start_date,
      end_date: this.end_date,
      table: waiters_table
    };
    this._reportService.generatePdfToReport(object_pdf);
  }

  // Boton enviar fechas para generar reporte
  btnSendToReport() {
    this.loading_flag = true;
    this._reportService.getReportForWaiters(this.start_date, this.end_date, this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this.array_waiters = response.waiters;
          this.total_cash = response.cash_general;
          this.total_card = response.card_general;
          this.total_general = response.total_general;
          if(this.user_logged.role == 'MAIN') {
            this.btnGeneratePdf();
          }
          this.loading_flag = false;
        }
      }, error => {
        console.log(<any>error);
      }
    );
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
