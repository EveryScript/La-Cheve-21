import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public user_logged = this._userService.getUserLogged();
  public user_role = this.user_logged.role;
  public menus: any;
  constructor(
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    const all_menus = [
      {
        role: 'ADMIN', menus: [
          { name: 'Admin', path: '/admin', icon:'assets/img/icons/admin.png' },
          // { name: 'Mesas', path: '/tables', icon:'assets/img/icons/waiter.png' },
          // { name: 'Cocina', path: '/cook', icon:'assets/img/icons/cook.png' },
          // { name: 'Bar', path: '/bar', icon:'assets/img/icons/bar.png' }
        ]
      },
      {
        role: 'WAITER', menus: [
          { name: 'Mesas', path: '/tables', icon:'assets/img/icons/waiter.png' },
        ]
      },
      {
        role: 'COOK', menus: [
          { name: 'Cocina', path: '/cook', icon:'assets/img/icons/cook.png' },
        ]
      },
      {
        role: 'BAR', menus: [
          { name: 'Bar', path: '/bar', icon:'assets/img/icons/bar.png' }
        ]
      },
    ];

    let [data] = all_menus.filter((el) => { return el.role == this.user_role });
    this.menus = data.menus
    //console.warn(this.menus)
  }

}
