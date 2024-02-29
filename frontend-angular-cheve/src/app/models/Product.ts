// Modelo de datos de Productos
export class Product {
    constructor(
        public id: string,
        public name: string,
        public price: string,
        public type: string
    ){}
}