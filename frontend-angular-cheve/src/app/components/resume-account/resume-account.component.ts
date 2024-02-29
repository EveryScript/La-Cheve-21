import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Imports principales
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';
import { TableService } from 'src/app/services/table.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-resume-account',
  templateUrl: './resume-account.component.html',
  styleUrls: ['./resume-account.component.css'],
  providers: [ OrderService, AccountService, UserService, TableService ]
})

export class ResumeAccountComponent implements OnInit {
  // Propiedades
  public token = this._userService.getToken();
  public table_id: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _tableService: TableService
  ){
    // Verificar si existe parametro por URL (id de cuenta)
    this._route.params.subscribe( params => {
      this.table_id = params['id_table'];
    });
  }

  ngOnInit(): void {
    
  }
  // Sumar las cantidades de todos los pedidos
  sumPriceAmount(price:number, amount:number) {
    let sum = price * amount;
    return sum;
  }

  // Volver a la pagina de mesas
  btnReturnTables() {
    // Actualizar cuenta a finalizada
    this._tableService.updateStatus(this.table_id, 'FREE', this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this._router.navigate(['/tables']);
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }
}
