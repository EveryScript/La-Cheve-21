import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Imports principales
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { TableService } from 'src/app/services/table.service';

// Importing moment.js
import * as moment from 'moment'; moment.locale("es");
import AWN from 'awesome-notifications'; // Awesome Notifications

@Component({
  selector: 'app-account-used',
  templateUrl: './account-used.component.html',
  styleUrls: ['./account-used.component.css'],
  providers: [ OrderService, AccountService, UserService, TableService ]
})
export class AccountUsedComponent implements OnInit {

  // Propiedades
  public id_table: any;
  public id_new_table: any;
  public id_account: any;
  public all_tables: any;
  public user_logged = this._userService.getUserLogged();
  public token = this._userService.getToken();
  public orders: any;
  public account: any;
  public notifier: any;
  public cooking_flag = false;
  public table_name = '';
  public table_status = '';
  public total_price = '';
  public pay_method = '';

  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _accountService: AccountService,
    private _tableService: TableService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.notifier = new AWN(); // Notificador Awesome
    
    // Capturar párametros
    this._route.params.subscribe(params => {
      this.id_table = params['id_table'];
    });
  }

  ngOnInit() {
    // Cargar las ordenes de la mesa
    this._orderService.getOrdersByIdTable(this.id_table, this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this.id_account = response.account.id;
          this.orders = response.account.orders;
          this.table_name = response.account.table.name;
          this.table_status = response.account.table.status;
          this.total_price = response.account.total_price;
          this.pay_method = response.account.pay_method;
          this.cooking_flag = response.pending_flag;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Sumar las cantidades de todos los pedidos
  sumPriceAmount(price: string, amount: string) {
    let result = parseInt(price) * parseInt(amount);
    return result.toString();
  }

  // Realizar nuevas Ordenes
  btnNewOrders() {
    this._router.navigate(['/products/' + this.id_table + '/' + this.id_account]);
  }

  // Actualizar el metodo de pago
  updatePayMethod(method: string) {
    this.notifier.confirm('¿Desea cambiar el método de pago?',
      () => { // YES
        // Cambiar metodo de pago
        this._accountService.updatePayMethod(this.id_account, method, this.token).subscribe(
          response => {
            if (response.status == 'success') {
              this.notifier.success('Se ha cambiado el metodo de pago');
            }
          }, error => {
            console.log(<any>error);
          }
        );
      }, // No
      () => { }, {
        labels: { confirm: 'METODO DE PAGO' }
    }
    );
  }

  // Finalizar la cuenta
  btnFinishAccount() {
    this.notifier.confirm('¿Está seguro de que desea finalizar la cuenta?',
      () => { // YES
        this._accountService.updateStatusAccount(this.id_account, 'FINISHED', this.token).subscribe(
          response => {
            if(response.status == 'success') {
              this._router.navigate(['/resume/'+this.id_table]);
            }
          }, error => {
            console.log(<any>error);
          }
        );
      }, // No
      () => { }, {
        labels: { confirm: 'FINALIZAR CUENTA' }
    }
    );
  }

  // Boton transferir mesa - cargar mesas (novedad)
  btnTransferTable() {
    this._tableService.allByStatus('FREE').subscribe(
      response => {
        if(response.status == 'success') {
          this.all_tables = response.tables;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Boton confirmar transferencia de mesas
  btnConfirmTransfer() {
    this._accountService.updateTransferAccount(this.id_account, this.id_table, this.id_new_table, this.token).subscribe(
      response => {
        if(response.status == 'success') {
          //this.notifier.success('La cuenta se ha transferido a otra mesa correctamente');
          let onOk = () => {this.notifier.info('You pressed OK')};
          this.notifier.confirm('La cuenta y las mesas se han actualizado correctamente',
            () => { this._router.navigate(['/tables']); },
            false, { labels: { confirm: 'Cuenta actualizada' }}
          )
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Formato de texto de la hora
  formatTimeAgo(hour:string) {
    let to_now = moment(hour).format('LT');
    return to_now;
  }

  // Volver a la pagina de mesas
  btnReturnTables() {
    this._router.navigate(['/tables']);
  }

}
