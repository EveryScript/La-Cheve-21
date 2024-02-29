import { Component, OnInit } from '@angular/core';
// Imports principales
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { global } from 'src/app/services/global';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [ UserService ]
})

export class UserEditComponent implements OnInit {
  // Propiedades
  public edit_mode: boolean;
  public user: User;
  public user_logged = this._userService.getUserLogged();
  public token = this._userService.getToken();
  public url = global.url;
  public afuConfig: any;
  public pass_flag: boolean;
  public pass_a: string;
  public pass_b: string;
  public actual_image: any;
  public notifier = new AWN();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    // Modo de creación de usuarios
    this.edit_mode = false;
    this.user = new User('', '', '', '', '', '', '');
    this.pass_flag = false;
    this.pass_a = '';
    this.pass_b = '';
    // Modo de edición de usuario existente (id)
    this._route.params.subscribe(
      params => {
        if(params['id']) {
          this._userService.user(params['id']).subscribe(
            response => {
              if(response.status == 'success') {
                this.edit_mode = true;
                this.user = response.user;
                this.pass_a = '';
                this.pass_b = '';
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        } 
      }
    );
  }

  ngOnInit(): void {
    // Configuración Angular File Uploader
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg, .png, .jpeg, .gif",
      maxSize: "10",
      uploadAPI: {
        url: this.url+'user/upload-avatar',
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
        selectFileBtn: 'Selecciona tu avatar',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        attachPinBtn: 'Selecciona tu avatar',
        afterUploadMsg_success: 'Avatar actualizado',
        afterUploadMsg_error: 'Error en la subida',
        sizeLimit: 'Tamaño máximo de imagen'
      }
    }
  }

  // Submit UserForm
  onSubmit(form: any) {
    if(this.edit_mode){
      this._userService.update(this.user, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/user-list']);
          }
          if(response.status == 'warning-update') {
            this.notifier.warning(response.message);
            this.user.username = '';
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    } else {
      this._userService.save(this.user, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/user-list']);
          }
          if(response.status == 'warning-create') {
            this.notifier.warning(response.message);
            this.user.username = '';
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    }
  } 

  // Redirección a usuarios
  backToUsersList() {
    this._router.navigate(['/user-list']);
  }

  // Verificar misma contraseña
  verifySamePassword() {
    if(this.pass_a == this.pass_b) {
      this.pass_flag = true;
      this.user.password = this.pass_b;
    } else {
      this.pass_flag = false;
    }
  }
}
