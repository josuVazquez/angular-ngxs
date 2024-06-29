import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { Product } from '../product/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CartItem, MAX_TOTAL_QUANTITY } from '../cart/cart.model';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  maxQuantity = MAX_TOTAL_QUANTITY;
  product = input.required<Product>();
  quantity = signal(1);
  @Output() addToCartEvent = new EventEmitter<CartItem>();

  increment() {
    this.quantity.update((value) => value + 1);
  }

  decrement() {
    this.quantity.update((value) => (value > 1 ? value - 1 : value));
  }

  addToCart() {
    this.addToCartEvent.emit({
      ...this.product(),
      quantity: this.quantity(),
    });
  }
}
