import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  api = 'https://fakestoreapi.com/products';
  
  constructor(private httpClient: HttpClient) { }

  getProducts() {
    return this.httpClient.get<Product[]>(`${this.api}`);
  }
}
