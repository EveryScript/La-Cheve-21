import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/Account';
import { Table } from 'src/app/models/Table';
import AWN from 'awesome-notifications'; // Awesome Notifications
// Imports principales
import { TableService } from 'src/app/services/table.service';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  providers: [TableService, AccountService, UserService, OrderService]
})
export class TableListComponent implements OnInit {
  // Propiedades
  public tables: any;
  public account: Account;
  public table: Table;
  public order = { status: "COMPLETED" };
  public token = this._userService.getToken();
  public notifier: any;

  constructor(
    private _tableService: TableService,
    private _accountService: AccountService,
    private _orderService: OrderService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.notifier = new AWN(); // Notificador Awesome
    this.account = new Account('', '', '', '', '');  // Empty account
    this.table = new Table('', '', '', '');  // Empty table
    this.getAllTables();
  }

  ngOnInit(): void {
  }

  // Obtener todas las mesas
  getAllTables() {
    this._tableService.all().subscribe(
      response => {
        if (response.status == 'success') {
          this.tables = response.tables;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  // Boton editar una mesa
  btnEditTable(id: any) {
    this._router.navigate(['/table-edit/' + id]);
  }
  // Boton eliminar mesa
  btnDeleteTable(id: any) {
    this.notifier.confirm(
      '¿Está seguro de eliminar esta mesa?. Esta acción es irreversible',
      () => { // YES
        this._tableService.delete(id, 'DELETED', this.token).subscribe(
          response => {
            if (response.status == 'success') {
              this.getAllTables();
              this.notifier.success('La mesa ha sido eliminada');
            }
          }, error => {
            console.log(<any>error);
          }
        );
      },
      () => { },
      { labels: { confirm: 'ELIMINAR MESA' } }
    );

  }
  // close account button
  btnCloseAccount(table_id: any) {
    this.notifier.confirm('Una vez finalizada la cuenta, los pedidos serán completados y guardados y la mesa quedará libre. Las notificaciones pendientes se reiniciarán despues de unos minutos. ¿Esta seguro de cerrar esta cuenta?',
      () => { // YES
        this.updateTable(table_id);
        this.updateAccountAndOrders(table_id);
      }, // No
      () => { }, {
      labels: { confirm: 'CERRAR CUENTA' }
    }
    );

  }
  // Liberar mesa
  updateTable(table_id: any) {
    this._tableService.updateStatus(table_id, 'FREE', this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.notifier.success('Mesa liberada');
          this.getAllTables();
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }
  // Liberar cuenta
  updateAccountAndOrders(table_id:string) {
    this._accountService.getAccountByIdTable(table_id, this.token).subscribe(
      response => {
        if (response.status == 'success') {
          let account_id = response.account.id;
          this._orderService.updateAlllOrders(account_id, 'COMPLETED', this.token).subscribe(
            response => {
              if (response.status == 'success') { this.notifier.success('Ordenes del menu y del bar completadas'); }
            }, error => {
              console.log(<any>error);
            }
          );
          this._accountService.updateStatusAccount(account_id, 'FINISHED', this.token).subscribe(
            response => {
              if (response.status == 'success') { this.notifier.success('Cuenta finalizada'); }
            }, error => {
              console.log(<any>error);
            }
          );
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }
}
