import { Component, OnInit } from '@angular/core';
// Import principales
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WebSocketService } from 'src/app/services/websocket.service';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})
export class HeaderComponent implements OnInit {
  // Propiedades

  public user_logged = this._userService.getUserLogged();
  public token: any;
  public url: string;
  public notifier: any;
  public user_id: string = this.user_logged.sub;


  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socket: WebSocketService,
  ) {
    // Notificador Awesome
    this.notifier = new AWN();
    // Verificación de login de Usuarios
    this.token = this._userService.getToken();
    this.url = global.url;

  }

  ngOnInit(): void {
    //console.warn('heador solo 1 vez')
  }
  // Boton cerrar sesión
  public closeSesion() {
    this.notifier.confirm(
      '¿Está seguro de que quiere salir?',
      () => { // YES
        this._socket.echo.disconnect();//cerramos y desconectamos del websocket
        // Cerrar sesión
        localStorage.removeItem('user_logged');
        localStorage.removeItem('token');
        localStorage.removeItem('active_area');
        this.user_logged = null;
        this.token = null;
        this._router.navigate(['/']);
      },
      () => { },
      { labels: { confirm: 'CERRAR SESIÓN' } }
    );
  }

  // Editar un usuario
  btnEditUser() {
    this._router.navigate(['/user-edit/' + this.user_logged.sub + '/user']);
  }
}
