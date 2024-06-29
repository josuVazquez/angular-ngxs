import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl = 'https://fakestoreapi.com/carts/7';
  constructor(private httpClient: HttpClient) { }

  addToCart(products: any) {
    return this.httpClient.put(`${this.apiUrl}`, {
      userId: 3,
      date: new Date(),
      products
    });
  }

  removeProduct(products: any) {
    return this.httpClient.put(`${this.apiUrl}`, {
      userId: 3,
      date: new Date(),
      products
    });
  }

  updateProduct(products: any) {
    return this.httpClient.put(`${this.apiUrl}`, {
      userId: 3,
      date: new Date(),
      products
    });
  }

}
