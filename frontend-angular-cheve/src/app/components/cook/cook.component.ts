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
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css'],
  providers: [OrderService, UserService, TableService]
})

export class CookComponent implements OnInit {
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
    this.loadMenuOrdersPendient('PENDING');
    this.loadMenuOrdersCompleted('COMPLETED');
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
      this.loadMenuOrdersPendient('PENDING')
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
      resp => { console.warn(resp) }, error => {
        console.log(<any>error);
      }
    );
  }

  //@end logic notificacion ***************************************************************************


  // Completar un conjunto de ordenes (con try y transact)
  btnCompleteOrder(account_id: string, table_id: string) {
    this.loading_flag = true;
    this._orderService.updateMenuOrders(account_id, 'COMPLETED', 'READY', this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.loadMenuOrdersPendient('PENDING');
          this.loadMenuOrdersCompleted('COMPLETED');
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
  loadMenuOrdersPendient(status: string) {
    this._orderService.getMenuOrdersByUser(status, this.token).subscribe(
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
  loadMenuOrdersCompleted(status: string) {
    this._orderService.getMenuOrdersByUser(status, this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.accounts_completed = response.accounts;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Recarga boton
  btnReloadData() {
    this.loadMenuOrdersPendient('PENDING');
    this.loadMenuOrdersCompleted('COMPLETED');
  }

  // Formato de texto de la hora
  formatTimeAgo(hour: string) {
    let to_now = moment(hour).format('LT');
    return to_now;
  }
}
