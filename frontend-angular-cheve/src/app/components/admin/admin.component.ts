import { Component, OnInit } from '@angular/core';
// Imports principales
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ UserService ]
})

export class AdminComponent implements OnInit {
  // Propiedades
  public user_logged: any;
  public token: any;
  public url = global.url;
  public notifier: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    // Notificador Awesome
    this.notifier = new AWN();
    this.user_logged = this._userService.getUserLogged();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {

  }

  // Boton cerrar sesión
  public closeSesion() {
    this.notifier.confirm(
      '¿Está seguro de que quiere salir?',
      () => { // YES
        //this.notifier.info('You pressed OK')
        // Cerrar sesión
        localStorage.removeItem('user_logged');
        localStorage.removeItem('token');
        this.user_logged = null;
        this.token = null;
        this._router.navigate(['/']);
        
      },() => { // NO
      },
      {
        labels: {
          confirm: 'CERRAR SESIÓN'
        }
      }
    )
  }

}
