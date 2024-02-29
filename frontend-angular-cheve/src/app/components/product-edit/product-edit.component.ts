import { Component, OnInit } from '@angular/core';
// Imports principales
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
  providers: [ ProductService, UserService ]
})
export class ProductEditComponent implements OnInit {
  // Propiedades
  public product: Product;
  public edit_mode: boolean;
  public url = global.url;
  public token = this._userService.getToken();
  public product_id: any;
  public afuConfig: any;
  public actual_image: any;

  constructor(
    private _userService: UserService,
    private _productService: ProductService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    this.edit_mode = false;
    // Definiendo modo de uso de formulario
    this.product = new Product('', '', '', 'MENU');
    // Obteniendo el id de la URL
    this._route.params.subscribe(params => {
      this.product_id = params['id'];
    });
  }

  ngOnInit(): void {
    // Cargar valores si hay id por la URL
    if(this.product_id) {
      this._productService.one(this.product_id).subscribe(
        response => {
          if(response.status == 'success') {
            this.product = response.product;
            this.edit_mode = true;
            //console.log(this.product);
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    }
    // Configuración Angular File Uploader
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg, .png, .jpeg, .gif",
      maxSize: "10",
      uploadAPI: {
        url: this.url+'product/upload-image',
        headers: {
          "Authorization" : this.token
        },
        responseType: 'json'
      },
      theme: "attachPin",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: true,
      fileNameIndex: true,
      autoUpload: true,
      replaceTexts: {
        selectFileBtn: 'Selecciona la imagen del producto',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        attachPinBtn: 'Imagen del producto',
        afterUploadMsg_success: 'Imagen actualizada',
        afterUploadMsg_error: 'Error en la subida',
        sizeLimit: 'Tamaño máximo de imagen'
      }
    }
  }

  // Boton guardar nuevo producto
  onSubmit(form: any) {
    this.product.price = this.product.price.toString();
    if(this.edit_mode) {
      this._productService.update(this.product, this.product_id, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/product-list']);
          }
        }, error => {
          console.log(<any>error);
        }
      );
    } else {
      this._productService.save(this.product, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/product-list']);
          }
        }, error => {
          console.log(<any>error);
        }
      );
    }
  }

  // Subir imagen de producto
  /*uploadImage(data: any) {
    // Actualizar foto ahora
    let params = data.body;
    this.product.image = params.image;
    this.actual_image = params.image;
    //console.log(this.product);
  }*/

  // Boton ir atras
  backToListProduct() {
    this._router.navigate(['/product-list']);
  }
}
 