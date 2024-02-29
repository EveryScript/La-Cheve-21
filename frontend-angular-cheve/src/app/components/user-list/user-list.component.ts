import { Component, OnInit } from '@angular/core';
// Imports principales
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
// Awesome Notifications
import AWN from 'awesome-notifications';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ UserService ]
})
export class UserListComponent implements OnInit {
  // Propiedades
  public users: any;
  public user_logged = this._userService.getUserLogged();
  public token = this._userService.getToken();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  // Cargar todos los usuarios
  loadAllUsers() {
    // Cargar todos los usuarios
    this._userService.all().subscribe(
      response => {
        if(response.status == 'success')
          this.users = response.users;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  // Formato de rol de usuario
  formatRoleUser(role:string) {
    let label_role;
    switch (role) {
      case 'ADMIN': label_role = 'Administrador'; break;
      case 'MAIN': label_role = 'Principal'; break;
      case 'WAITER': label_role = 'Mesero'; break;
      case 'COOK': label_role = 'Cocina'; break;
      case 'BAR': label_role = 'Bar'; break;
      default: label_role = 'Usuario eliminado'; break;
    }
    return label_role;
  }

  // Eliminar o inhabilitar usuario
  btnDeleteUser(id_user:any) {
    // AWN Alert
    let notifier = new AWN();
    let onOk = () => {
      this._userService.unable(id_user, 'DELETED', this.token).subscribe(
        response => {
          console.log(response);
          if(response.status == 'success') {
            this.loadAllUsers()
          }
        }, error => {
          console.log(<any>error);
        }
      );
    };
    let options = { labels: { confirm: 'ELIMINAR USUARIO' } };
    notifier.confirm('¿Está seguro de que desea eliminar a este usuario?. Una vez eliminado no se pueden deshacer los cambios.', onOk, undefined, options);
  }

  // Editar un usuario
  btnEditUser(id:string) {
    this._router.navigate(['/user-edit/'+id+'/admin']);
  }

}
