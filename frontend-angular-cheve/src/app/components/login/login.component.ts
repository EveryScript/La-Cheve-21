import { Component, OnInit } from '@angular/core';

// Imports
import { Router, ActivatedRoute, Params } from '@angular/router'; // Routers
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service'; // Servicio de Usuario

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})

export class LoginComponent implements OnInit {
  // Popiedades del componente
  public user: User;
  public user_logged: any;
  public token: any;
  public head_message: string;
  public spinner: boolean;
  public show_password = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService
  ) {
    this.spinner = false;
    this.user = new User('', '', '', '', '', '', '');
    this.head_message = 'Ingresa tus datos para acceder al sistema';
  }

  ngOnInit(): void {
  }

  // --- Login de usuarios (Mongo) ---
  onSubmit(form: any) {
    this.spinner = true;
    this._userService.signUp(this.user).subscribe(  // Get user info
      response => {
        if (response.status == 'success') {
          this.user_logged = response.user; // Set user logged
          if (this.user_logged.role != 'DELETED') {
            this.user.get_token = 'true';
            this._userService.signUp(this.user).subscribe( // Get token
              response => {
                this.token = response.token; // Set token
                // Guardar datos de sesion
                localStorage.setItem('token', this.token);
                localStorage.setItem('user_logged', JSON.stringify(this.user_logged));
                // Redirección
                switch (this.user_logged.role) {
                  case 'ADMIN':
                    this._router.navigate(['/admin']);
                    break;
                  case 'MAIN':
                    this._router.navigate(['/admin']);
                    break;
                  case 'WAITER':
                    this._router.navigate(['/tables']);
                    break;
                  case 'COOK':
                    this._router.navigate(['/cook']);
                    break;
                  case 'BAR':
                    this._router.navigate(['/bar']);
                    break;
                }
              },
              error => {
                console.log(<any>error);
              }
            );
          } else {
            this.spinner = false;
            this.head_message = 'El usuario ingresado ha sido eliminado';
          }
        } else {
          this.spinner = false;
          this.head_message = 'El nombre de usuario o la contraseña son incorrectas';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  // Boton mostrar contraseña
  btnShowPassword() {
    let txt_password:any = document.getElementById('floatingPassword');
    if(this.show_password) {
      txt_password.type = 'password';
      this.show_password = false;
    } else {
      txt_password.type = 'text';
      this.show_password = true;
    }
  }
}
