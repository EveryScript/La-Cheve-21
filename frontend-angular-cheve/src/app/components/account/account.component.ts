import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Imports principales
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { TableService } from 'src/app/services/table.service';
import { Account } from 'src/app/models/Account';
// Importing moment.js
import * as moment from 'moment'; moment.locale("es");

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [ OrderService, UserService, AccountService, TableService ]
})

export class AccountComponent implements OnInit {
  // Propiedades
  public account: Account;
  public user_logged = this._userService.getUserLogged();
  public token = this._userService.getToken();
  public table_id: any;
  public table_name = '';

  constructor(
    private _userService: UserService,
    private _accountService: AccountService,
    private _tableService: TableService,
    private _router: Router,
    private _route: ActivatedRoute
  ){

    // Verificar si existe parametro por URL (id de mesa)
    this._route.params.subscribe( params => {
      this.table_id = params['id_table'];
    });

    // Asignar valores a la cuenta vacia
    this.account = new Account('', '', 'CASH', this.user_logged.sub, this.table_id);
  }

  ngOnInit() {
    // Cargar el nombre de la mesa
    this._tableService.one(this.table_id).subscribe(
      response => {
        if(response.status == 'success') {
          this.table_name = response.table.name;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Guardar una nueva cuenta
  btnSaveAccount() {
    this._accountService.save(this.account, this.token).subscribe(
      response => {
        if(response.status == 'success') {
          let new_account_id = response.account.id; // Id de la nueva cuenta
          this._router.navigate(['products/'+this.table_id+'/'+new_account_id]);
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Settear metodo de pago
  setPayMethod(method:string) {
    this.account.pay_method = method;
  }
  
  // Volver a la pagina de mesas
  btnReturnTables() {
    this._router.navigate(['/tables']);
  }
}
