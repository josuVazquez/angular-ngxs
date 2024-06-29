import { Product, ProductRating } from "../product/product.model";

export interface CartItem extends Product {
    quantity: number;
}

export const MAX_TOTAL_PRICE = 1000;
export const MAX_PRODUCTS = 10;
export const MAX_TOTAL_QUANTITY = 20;

export class Cart {
    items: CartItem[];

    constructor() {
        this.items = [];
    }

    addProduct(product: Product, quantity: number) {
        if (this.items.length >= MAX_PRODUCTS) {
            throw new Error('The number of different products in the cart cannot exceed 10');
        }
        if (this.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + product.price * quantity > MAX_TOTAL_PRICE) {
            throw new Error('Total price of the cart cannot exceed $1000');
        }
        if (quantity > MAX_TOTAL_QUANTITY) {
            throw new Error('The total quantity of a product in the cart cannot exceed 20');
        }
        this.items.push({ ...product, quantity });
    }
}