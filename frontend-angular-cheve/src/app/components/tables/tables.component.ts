import { Component, OnInit } from '@angular/core';
// Imports principales
import { TableService } from 'src/app/services/table.service';
import { UserService } from 'src/app/services/user.service';
import { AccountService } from 'src/app/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/websocket.service';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
  providers: [TableService, UserService, AccountService]
})
export class TablesComponent implements OnInit {
  // Propiedades
  public areas: any;
  public tables_by_area: any;
  public token = this._userService.getToken();
  public user_logged = this._userService.getUserLogged();
  public active_area: any;
  public notifier: any; // Awesome Notifications
  public counter_notifications: number;
  public user_id: string = this.user_logged.sub;
  //public sound_notification = new Audio('assets/sounds/cook-bell.wav');

  constructor(
    private _tableService: TableService,
    private _userService: UserService,
    private _accountService: AccountService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socket: WebSocketService,
  ) {
    this.active_area = '';
    this.notifier = new AWN(); // Notificador Awesome
    this.counter_notifications = 0;
  }

  ngOnInit(): void {
    this.loadAllAreasAndTables();
    this.handleEvent();
  }

  ngOnDestroy(): void {
    this._socket.echo.leave(`App.Models.User.${this.user_id}`);
  }

  handleEvent() {
    //console.error(`authenticate: ${this.user_id}`)
    this._socket.echo.private(`App.Models.User.${this.user_id}`).notification((notification: any) => {
      //console.error(notification);
      this.reloadAreas(notification);
      this.reloadTables(notification);
    })
  }

  //Metodo para leer las nitficaciones
  readNotifications(el: any, table_status: string) {
    const params = {
      user_id: this.user_id,
      account_id: el.account.id,
      table_id: el.account.table_id,
      table_status: table_status
    }
    this._tableService.updateNotifications(params, this.token).subscribe(
      resp => { console.warn(resp) }, error => {
        console.log(<any>error);
      }
    );
  }

  // recargarga solo las areas
  reloadAreas(notification: any) {
    const id = this.user_id
    this._tableService.allAreas2(id).subscribe(response => {
      if (response.status == 'success') {
        this.areas = response.areas;
      }
    }, error => {
      console.log(<any>error);
    }
    );
  }

  reloadTables(notification: any) {
    const data = notification.data.data.order || null;
    const notify_area = notification.data.data.order.area || null;
    const active_area = localStorage.getItem('active_area');

    const id = this.user_id
    if (notify_area === active_area) {
      this._tableService.allByArea(notify_area).subscribe(
        response => {
          //console.table(response.tables)
          this.tables_by_area = response.tables;
        }, error => {
          console.log(<any>error);
        }
      );
    }
  }


  // Cargar las areas y las mesas
  loadAllAreasAndTables() {
    this.counter_notifications = 0;
    const id = this.user_id
    this._tableService.allAreas2(id).subscribe(
      response => {
        if (response.status == 'success') {
          this.areas = response.areas;
          // Cargar el primer grupo de mesas o el grupo almacenado en localstorage
          if (localStorage.getItem('active_area') != null) {
            this.active_area = localStorage.getItem('active_area');
            this.showTablesByArea(this.active_area);
          } else {
            this.showTablesByArea(this.areas[0].area);
          }
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Mostrar mesas segun un area
  showTablesByArea(area: string) {
    this.counter_notifications = 0;
    localStorage.setItem('active_area', area);
    this.active_area = area;
    this._tableService.allByArea(area).subscribe(
      response => {
        if (response.status == 'success') {
          this.tables_by_area = response.tables;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Formato del estado de la mesa
  formatTableStatus(status: string) {
    let format_text = '';
    switch (status) {
      case 'FREE': format_text = 'LIBRE'; break;
      case 'OCCUPIED': format_text = 'ACTIVA'; break;
      case 'READY': format_text = 'LISTO'; break;
      case 'COOKING': format_text = '🔥'; break;
    }
    return format_text;
  }

  // Obtener la cuenta de una mesa
  showAccountByTable(id_table: string) {
    this._accountService.getAccountByIdTable(id_table, this.token).subscribe(
      response => {
        if (response.status == 'success') {
          if (response.table_status == 'FREE') {
            this._router.navigate(['/account/' + id_table]);
          } else {
            if (response.account.user_id == this.user_logged.sub) {
              this._router.navigate(['/account-used/' + id_table]);
              this.readNotifications(response, response.table_status);
            } else {
              this.notifier.warning('No puedes acceder a esta cuenta por que ha sido creada por otro usuario');
            }
          }
        }
      }, error => {
        console.log(<any>error);
      }
    );
    // (A N T E S)
    // this._tableService.oneAndOptions(id_table).subscribe(
    //   response => {
    //     console.warn(response);
    //     if (response.status == 'success') {
    //       let table_status = response.table.status;
    //       if (table_status == 'FREE') {
    //         this._router.navigate(['/account/' + id_table]);
    //       } else {
    //         // Verificar el acceso a las mesas de los usuarios
    //         this._accountService.getAccountByIdTable(id_table, this.token).subscribe(
    //           response => {
    //             if (response.status == 'success') {
    //               if (response.account.user_id == this.user_logged.sub) {
    //                 this._router.navigate(['/account-used/' + id_table]);
    //                 this.readNotifications(response, table_status);
    //               } else {
    //                 this.notifier.warning('No puedes acceder a esta cuenta por que ha sido creada por otro usuario');
    //               }
    //             }
    //           }, error => {
    //             console.log(<any>error);
    //           }
    //         );
    //       }
    //     }
    //   }, error => {
    //     console.log(error);
    //   }
    // );
  }
}
