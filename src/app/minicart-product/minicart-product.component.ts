import { NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Output, computed, effect, inject, input } from '@angular/core';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { CartActions } from '../cart/cart.actions';
import { CartItem } from '../cart/cart.model';
import { debounceTime, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

class IncrementDecrementProduct {
  static readonly type = '[Cart] Increment/Decrement Product';

  constructor(public quantity: number) {}
}

@Component({
  selector: 'minicart-product',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './minicart-product.component.html',
  styleUrl: './minicart-product.component.scss',
})
export class MinicartProductComponent {
  product = input.required<CartItem>();
  store = inject(Store);
  @Output() remove = new EventEmitter<void>();
  actions$ = inject(Actions);
  auxQuantity = 1;

  constructor() {
    effect(() => {
      this.auxQuantity = this.product().quantity;
    });

    this.actions$
      .pipe(
        ofActionDispatched(IncrementDecrementProduct),
        map((action: IncrementDecrementProduct) => action.quantity),
        debounceTime(250),
        takeUntilDestroyed()
      )
      .subscribe((quantity) => {
        this.store.dispatch(
          new CartActions.UpdateCart({ ...this.product(), quantity })
        );
      });
  }

  decrement() {
    this.auxQuantity = this.auxQuantity - 1;
    this.store.dispatch(new IncrementDecrementProduct(this.auxQuantity));
  }

  increment() {
    this.auxQuantity = this.auxQuantity + 1;
    this.store.dispatch(new IncrementDecrementProduct(this.auxQuantity));
  }

  removeFromCart() {
    this.store.dispatch(new CartActions.RemoveFromCart(this.product()));
  }
}
