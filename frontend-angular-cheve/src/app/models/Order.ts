// Modelo de datos de Ordenes
export class Order {
    constructor(
        public amount: string,
        public product_id: string,
        public product_type: string,
        public color_type: string,
        public product_name: string,
        public product_price: string
    ){}
}