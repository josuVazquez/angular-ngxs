import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CartActions } from '../cart/cart.actions';
import {
  CartItem,
  MAX_PRODUCTS,
  MAX_TOTAL_PRICE,
  MAX_TOTAL_QUANTITY,
} from '../cart/cart.model';
import { CartService } from './services/cart.service';
import { tap } from 'rxjs';

export class CartStateModel {
  items: CartItem[] = [];
  totalPrice: number = 0;
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: [],
    totalPrice: 0,
  },
})
@Injectable()
export class CartState {
  constructor(private cartService: CartService) {}

  @Selector()
  static getCartItems(state: CartStateModel) {
    return state.items;
  }

  @Selector()
  static getTotalPrice(state: CartStateModel) {
    return state.totalPrice.toFixed(2);
  }

  @Action(CartActions.AddToCart)
  addToCart(
    { getState, patchState }: StateContext<CartStateModel>,
    { cartItem }: CartActions.AddToCart
  ) {
    const { items } = getState();
    const productState = items.findIndex(
        (item) => item.id === cartItem.id
    );
    const newCart = [...items];
    if (productState !== -1) {
        newCart[productState] = {
            ...newCart[productState],
            quantity: newCart[productState].quantity + cartItem.quantity,
        };
    } else {
        newCart.push(cartItem);
    }
    this.cartBusinessLogic(newCart);
    return this.cartService.addToCart(newCart).pipe(
      tap((result) => {
        patchState({
          items: newCart,
          totalPrice: this.calculateTotalPrice(newCart),
        });
      })
    );
  }

  @Action(CartActions.UpdateCart)
  updateCart(
    { getState, patchState }: StateContext<CartStateModel>,
    { cartItem }: CartActions.UpdateCart
  ) {
    const { items } = getState();
    const updatedItems = items.map((item) => {
      if (item.id === cartItem.id) {
        return cartItem;
      }
      return item;
    });
    this.cartBusinessLogic(updatedItems);
    return this.cartService.updateProduct(updatedItems).pipe(
      tap((result) => {
        patchState({
          items: updatedItems,
          totalPrice: this.calculateTotalPrice(updatedItems),
        });
      })
    );
  }

  @Action(CartActions.RemoveFromCart)
  removeFromCart(
    { getState, patchState }: StateContext<CartStateModel>,
    { cartItem }: CartActions.RemoveFromCart
  ) {
    const { items } = getState();
    const updatedItems = items.filter(item => item.id !== cartItem.id);
        return this.cartService.removeProduct(updatedItems).pipe(
      tap((result) => {
        patchState({
          items: updatedItems,
          totalPrice: this.calculateTotalPrice(updatedItems),
        });
      })
    );
  }

  private cartBusinessLogic(items: CartItem[]) {
    if (items.find(product => product.quantity <= 0)) {
        throw new Error('Quantity of a product in the cart cannot be less than 1');
    }
    if (items.length >= MAX_PRODUCTS) {
      throw new Error(
        `The number of different products in the cart cannot exceed ${MAX_PRODUCTS}`
      );
    }
    if (
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) >
      MAX_TOTAL_PRICE
    ) {
      throw new Error(`Total price of the cart cannot exceed ${MAX_TOTAL_PRICE}`);
    }
    if (items.find( product => product.quantity > MAX_TOTAL_QUANTITY)) {
      throw new Error(
        `The total quantity of a product in the cart cannot exceed ${MAX_TOTAL_QUANTITY}`
      );
    }
  }

  private calculateTotalPrice(items: CartItem[]) {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
