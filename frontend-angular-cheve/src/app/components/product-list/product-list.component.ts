import { Component, OnInit } from '@angular/core';
// Import principales
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ ProductService, UserService ]
})
export class ProductListComponent implements OnInit {
  // Propiedades
  public products_menu: any;
  public products_bar: any;
  public products_all_search: any;
  public search_key: string;
  public token = this._userService.getToken();
  public notifier = new AWN(); // Notificador Awesome

  constructor(
    private _productService: ProductService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    this.search_key = '';
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

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

  // Boton de editar producto
  btnEditProduct(id:string) {
    this._router.navigate(['/product-edit/'+id]);
  }

  // Boton de busqueda de un producto
  searchProduct() {
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
      this.getAllProducts();
    }
  }

  // Boton eliminar un producto
  btnDeleteProduct(id_product:any) {
    this.notifier.confirm(
      '¿Está seguro de eliminar este producto?',
      () => { // YES
        this._productService.delete(id_product, 'DELETED', this.token).subscribe(
          response => {
            if(response.status == 'success') {
              this.getAllProducts();
              this.notifier.success('Producto eliminado correctamente');
            } else {
              this.notifier.warning('Ha ocurrido un error al eliminar el producto');
            }
          }, error => {
            console.log(<any>error);
            this.notifier.warning('El producto no puede ser eliminado, hay pedidos que usan este producto');
          }
        );
      },
      () => {},
      { labels: { confirm: 'ELIMINAR PRODUCTO' }}
    );
  }
}
