import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CartActions } from '../cart/cart.actions';
import {
  Cart,
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
    const state = getState();
    const productState = state.items.findIndex(
        (item) => item.id === cartItem.id
    );
    const newCart = [...state.items];
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
          totalPrice: newCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
        });
      })
    );
  }

  @Action(CartActions.UpdateCart)
  updateCart(
    { getState, patchState }: StateContext<CartStateModel>,
    { cartItem }: CartActions.UpdateCart
  ) {
    const state = getState();
    const updatedItems = state.items.map((item) => {
      if (item.id === cartItem.id) {
        return cartItem;
      }
      return item;
    });
    this.cartBusinessLogic(updatedItems);
    return this.cartService.updateProduct(cartItem).pipe(
      tap((result) => {
        patchState({
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
        });
      })
    );
  }

  @Action(CartActions.RemoveFromCart)
  removeFromCart(
    { getState, patchState }: StateContext<CartStateModel>,
    { cartItem }: CartActions.RemoveFromCart
  ) {
    const state = getState();
    const items = [...state.items.filter((item) => item.id !== cartItem.id)];
    return this.cartService.removeProduct(items).pipe(
      tap((result) => {
        patchState({
          items,
          totalPrice: items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
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
        'The number of different products in the cart cannot exceed 10'
      );
    }
    if (
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) >
      MAX_TOTAL_PRICE
    ) {
      throw new Error('Total price of the cart cannot exceed $1000');
    }
    if (items.find( product => product.quantity > MAX_TOTAL_QUANTITY)) {
      throw new Error(
        'The total quantity of a product in the cart cannot exceed 20'
      );
    }
  }
}
