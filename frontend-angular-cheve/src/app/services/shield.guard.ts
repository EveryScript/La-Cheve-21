// *** ESCUDO DE RUTAS  ***

import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class ShieldGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _userService: UserService
    ){
    }

    // CanActivate
    canActivate() {
        let user_logged = this._userService.getUserLogged();
        // Comprobar si el usuario esta logueado
        if(user_logged) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}