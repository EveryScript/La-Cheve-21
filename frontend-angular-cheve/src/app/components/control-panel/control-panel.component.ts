import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment'; moment.locale("es"); // Importing moment.js

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  providers: [ AccountService, UserService ]
})
export class ControlPanelComponent implements OnInit {
  // Propiedades
  public accounts: any;
  public token = this._userService.getToken();
  public user_logged = this._userService.getUserLogged();
  public accounts_flag = false;
  public time_ago: any;

  constructor(
    private _accountService: AccountService,
    private _userService: UserService
  ){ }

  ngOnInit(): void {
    //this.getAccountsControlPanel();
  }

  // Obtener las cuentas para ver tiempos de carga
  getAccountsControlPanel() {
    this.accounts_flag = true;
    this._accountService.getAllAccountsOrders(this.time_ago.toString(), this.token).subscribe(
      response => {
        console.warn(response);
        if(response.status == 'success') {
          this.accounts = response.accounts;
          this.accounts_flag = false;
        }
      }, error => {
        console.log(<any>error)
      }
    );
  }

  // Formato de hora
  formatTimeAgo(hour:string) {
    let to_now = moment(hour).format('LT');
    return to_now;
  }

  // Formato de estado de la cuenta
  formatAccountStatus(status:string) {
    let text_return = '';
    switch (status) {
      case 'ACTIVE':
          text_return = '💡 Cuenta activa'
      break;
      case 'FINISHED':
          text_return = '⛔ Cuenta finalizada'
      break;
      case 'PRINTED':
          text_return = '🖨️ Cuenta imprimida'
      break;
      case 'EMPTY':
          text_return = '⚠️ Cuenta vacia'
      break;
    }
    return text_return;
  }
}
