import { Component, OnInit } from '@angular/core';
// Imports necesarios
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { global } from 'src/app/services/global';
import { Order } from 'src/app/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { Table } from 'src/app/models/Table';
import { TableService } from 'src/app/services/table.service';
import { AccountService } from 'src/app/services/account.service';

// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductService, UserService, OrderService, TableService, AccountService]
})

export class ProductsComponent implements OnInit {
  // Propiedades
  public token = this._userService.getToken();
  public url = global.url;
  public table_to_update: any;
  public account_to_update: any;
  public products_menu: any;
  public products_bar: any;
  public array_orders: any;
  public new_id_account: any;
  public new_id_table: any;
  public sum_orders: any;
  public search_key: string;
  public products_all_search: any;
  public selecting_flag = true;
  public notifier = new AWN(); // Notificador Awesome

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _orderService: OrderService,
    private _tableService: TableService,
    private _accountService: AccountService
  ){
    // Capturar ids de la URL
    this._route.params.subscribe(params => {
      this.new_id_account = params['id_account'];
      this.new_id_table = params['id_table'];
    });

    // Definir array de ordenes
    this.array_orders = [];
    // Definir cantidad de suma total de ordenes
    this.sum_orders = 0;
    this.search_key = '';
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  // Obtener todos los productos
  getAllProducts() {
    // Productos del MENU
    this._productService.getProductsByType('MENU').subscribe(
      response => {
        if(response.status == 'success') {
          this.products_menu = response.products;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    // Products del BAR
    this._productService.getProductsByType('BAR').subscribe(
      response => {
        if(response.status == 'success') {
          this.products_bar = response.products;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  // Agregar elementos a un array de ordenes
  addOrder(id_product: any, name_product:string, type_product:string, type_color:string, price_product:string) {
    if(this.array_orders.length == 0) {
      let food = new Order('1', id_product, type_product, type_color, name_product, price_product);
      this.array_orders.push(food);
    } else {
      let flag = true;
      this.array_orders.map(function(element: any){
        if(element.product_id == id_product){
          let amount_number = Number(element.amount);
          amount_number+= 1;
          element.amount = amount_number.toString();
          flag = false;
        }
        return element;
      });

      if(flag) {
        let food = new Order('1', id_product, type_product, type_color, name_product, price_product);
        this.array_orders.push(food);
      }
    }
    this.sumAllOrders();
  }

  // Boton de envio de pedidos (con try y transact)
  btnSendAllOrders() {
    this.selecting_flag = false;
    this._orderService.save(this.new_id_account, 'COOKING', this.array_orders, this.token).subscribe(
      response => {
        if(response.status == 'success') {
          this._router.navigate(['account-used/'+this.new_id_table]);
        } else {
          this._router.navigate(['/tables']);
          this.notifier.warning('Ha ocurrido un error al guardar los pedidos.');
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  // Boton de busqueda de un producto
  btnSearchProduct() {
    if(this.search_key != '') {
      this._productService.search(this.search_key).subscribe(
        response => {
          if(response.status = 'success'){
            this.products_all_search = response.products;
          }
        },
        error => {
          console.log(<any>error);
        }
        );
    } else {
      this.products_all_search = false;
    }
  }

  // Sumar todas las ordenes efectuadas
  sumAllOrders() {
    this.sum_orders = 0;
    this.array_orders.forEach((element: { product_price: any; amount: any; }) => {
      let price_amount = +element.product_price * +element.amount;
      this.sum_orders += price_amount;
    });
  }

  // Eliminar un elemento del array de ordenes
  deleteOrderByIdProduct(index:number) {
    this.array_orders.splice(index, 1);
    this.sumAllOrders();
  }

  // Format type product text
  formatTypeProduct(type:string) {
    if(type == 'MENU')
      return 'bg-primary';
    else
      return 'bg-danger';  
  }

}
