import { Component, OnInit } from '@angular/core';
// Imports principales
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { TableService } from 'src/app/services/table.service';
import { WebSocketService } from 'src/app/services/websocket.service';

// Importing moment.js
import * as moment from 'moment'; moment.locale("es");
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
  providers: [OrderService, UserService, TableService]
})

export class BarComponent implements OnInit {
  // Propiedades
  public token = this._userService.getToken();
  public loading_flag: boolean;
  public order: any;
  public notifier: any;
  public sound_notification = new Audio('assets/sounds/bell-ring.wav');
  public accounts_pendient: any;
  public accounts_completed: any;
  public user_logged = this._userService.getUserLogged();
  public user_id: string = this.user_logged.sub;

  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _tableService: TableService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socket: WebSocketService,
  ) {
    this.notifier = new AWN(); // Notificador Awesome
    this.loading_flag = false;
  }

  ngOnInit(): void {
    // Carga de todas las ordenes
    this.loadBarOrdersPendient('PENDING');
    this.loadBarOrdersCompleted('COMPLETED');
    this.handleEvent();
  }
  
  ngOnDestroy():void{
    this._socket.echo.leave(`App.Models.User.${this.user_id}`);
  }

  //@init logic notificacion *************************************************************************
  handleEvent() {
    //console.error(`authenticate: ${this.user_id}`)
    this._socket.echo.private(`App.Models.User.${this.user_id}`).notification((notification: any) => {
      this.sound_notification.play();
      this.loadBarOrdersPendient('PENDING')
    })
  }
  // Metodo para leer las nitficaciones
  readNotifications(account_id: string, table_id: string) {
    const params = {
      account_id: account_id,
      table_id: table_id,
      user_id: this.user_id,
      table_status: "READY"
    }
    this._orderService.updateNotifications(params, this.token).subscribe(
      response => {
        console.warn(response)
      }, error => {
        console.log(<any>error);
      }
    );
  }
  //@end logic notificacion ***************************************************************************

  // Reload all data
  btnReloadData() {
    this.loadBarOrdersPendient('PENDING');
    this.loadBarOrdersCompleted('COMPLETED');
  }

  // Completar un conjunto de ordenes
  btnCompleteOrder(account_id: string, table_id: string) {
    this.loading_flag = true;
    this._orderService.updateBarOrders(account_id, 'COMPLETED', 'READY', this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.loadBarOrdersPendient('PENDING');
          this.loadBarOrdersCompleted('COMPLETED');
          this.readNotifications(account_id, table_id);
          this.notifier.success('Ordenes completadas');
        } else {
          this.notifier.warning('Error. Los pedidos no se han completado.');
          this.loading_flag = false;
        }
      }, error => {
        console.log(<any>error);
      }
      );
    }
    
    // Metodo cargar las ordenes
    loadBarOrdersPendient(status: string) {
      this._orderService.getBarOrdersByUser(status, this.token).subscribe(
        response => {
          if (response.status == 'success') {
            this.accounts_pendient = response.accounts;
            this.loading_flag = false;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Metodo cargar ordenes completadas
  loadBarOrdersCompleted(status: string) {
    this._orderService.getBarOrdersByUser(status, this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.accounts_completed = response.accounts;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Formato de texto de la hora
  formatTimeAgo(hour: string) {
    let to_now = moment(hour).format('LT');
    return to_now;
  }
}
