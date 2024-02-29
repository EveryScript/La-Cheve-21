import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Imports principales
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment'; moment.locale("es");
import AWN from 'awesome-notifications'; // Awesome Notifications

@Component({
  selector: 'app-resume-qr',
  templateUrl: './resume-qr.component.html',
  styleUrls: ['./resume-qr.component.css'],
  providers: [ OrderService, AccountService, UserService ]
})

export class ResumeQrComponent implements OnInit {
  // Propiedades
  public accounts = new Array();
  public token = this._userService.getToken();
  public user_logged = this._userService.getUserLogged();
  public selecting_flag = true;
  public notifier = new AWN(); // Notificador Awesome

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _orderService: OrderService,
    private _userService: UserService,
    private _accountService: AccountService
  ){
    this.accounts = [];
  }
  
  ngOnInit(): void {
    this.getAccountsPrint();
  }
      
  // Obtener todas las cuentas finalizadas
  getAccountsPrint() {
    this.selecting_flag = false;
    this._accountService.getAccountsByStatus('FINISHED', this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this.selecting_flag = true;
          this.accounts = response.accounts;
          /*this.accounts.forEach((account: any) => {
            const orders_format = this.groupOrdersByProduct(account.orders);
            account.orders = orders_format;
          });*/
        }
      }, error => {
        console.log(<any>error)
      }
    );
  }

  // Boton recargar lista de cuentas finalizadas
  btnReloadAccountsPrint() {
    this.getAccountsPrint();
  }

  // Agrupar las ordenes por productos
  groupOrdersByProduct(orders:any) {
    var array_orders = new Array();
    orders.forEach((order: any) => {
      if(array_orders.length == 0) {
        array_orders.push({ id: order.product.id, amount: order.amount, name: order.product.name, price: order.product.price });
      } else {
        var flag = true;
        var id_product = order.product.id;
        // Aumentar la cantidad
        array_orders.map(function(element: any){
          if(element.id == id_product){
            var amount_number = Number(element.amount);
            amount_number += Number(order.amount);
            element.amount = amount_number.toString();
            flag = false;
          }
          return element;
        });
        if(flag) {
          array_orders.push({ id: order.product.id, amount: order.amount, name: order.product.name, price: order.product.price });
        }
      }
    });
    return array_orders;
  }

  // Formatear el método de pago
  formatPayMethod(method: string) {
    let format = '';
    switch (method) {
      case 'CASH': format = 'Efectivo'; break;
      case 'CARD': format = 'Tarjeta'; break;
      default: format = ''; break;
    }
    return format;
  } 

  // Formato de texto de la hora
  formatTimeAgo(hour:string) {
    let to_now = moment(hour).format('LT');
    return to_now;
  }

  btnPrintTicket(id_account:string, table_html:any, pay_method:string) {
    this.selecting_flag = false
    this._accountService.updateStatusAccount(id_account, 'PRINTED', this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this.getAccountsPrint();
          this._accountService.generateAccountTicket(table_html, this.formatPayMethod(pay_method));
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Sumar las cantidades de todos los pedidos
  sumPriceAmount(price:number, amount:number) {
    let sum = price * amount;
    return sum;
  }

  // (N U E V O)
  // Boton eliminar un pedido
  btnDeleteOrder(account_id:any, product_id:any, created_at:any, amount:string, product_name:string) {
    this.notifier.confirm('¿Esta seguro de eliminar el pedido de '+amount+' '+product_name+'?',
      () => { // YES
        this.selecting_flag = false;
        const created_format = moment(created_at).format('Y-MM-DD H:mm:ss');
        this._orderService.deleteSpecificOrder(account_id.toString(), product_id.toString(), created_format.toString(), this.token).subscribe(
          response => {
            if(response.status == 'success') {
              this.notifier.success('El pedido de se ha eliminado correctamente');
              this.getAccountsPrint();
              this.selecting_flag = true;
            } else {
              this.notifier.warning('Ha ocurrido un error al eliminar el pedido');
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

  btnUpdateAccountEmpty(account_id:any) {
    this._accountService.updateStatusAccount(account_id, 'EMPTY', this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this.getAccountsPrint();
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }
}
