// Modelo de datos de Usuarios
export class User {
    constructor(
        public id: string,
        public name: string,
        public surname: string,
        public role: string,
        public username: string,
        public password: string,
        public get_token: string
    ){}
}