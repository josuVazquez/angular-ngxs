import { Product, ProductRating } from "../product/product.model";

export interface CartItem extends Product {
    quantity: number;
}

export const MAX_TOTAL_PRICE = 1000;
export const MAX_PRODUCTS = 10;
export const MAX_TOTAL_QUANTITY = 20;
