import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItem } from '../cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl = 'https://fakestoreapi.com/carts/7';
  constructor(private httpClient: HttpClient) { }

  updateCart(items: CartItem[]) {
    return this.httpClient.put(`${this.apiUrl}`, {
      userId: 3,
      date: new Date(),
      products: items
    });
  }

  addToCart(items: CartItem[]) {
    return this.updateCart(items);
  }

  removeProduct(items: CartItem[]) {
    return this.updateCart(items);
  }

  updateProduct(items: CartItem[]) {
    return this.updateCart(items);
  }

}
