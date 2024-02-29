// Modelo de datos de Cuenta
export class Account {
    constructor(
        public id: string,
        public status: string,
        public pay_method: string,
        public user_id: string,
        public table_id: string
    ){}
}