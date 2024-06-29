import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store} from '@ngxs/store';
import { MinicartProductComponent } from './minicart-product/minicart-product.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductsService } from './product/service/products.service';
import { CartState } from './cart/cart.state';
import { CartItem } from './cart/cart.model';
import { CartActions } from './cart/cart.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductCardComponent, MinicartProductComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-ngxs';
  productService = inject(ProductsService);
  store = inject(Store);
  products = toSignal(this.productService.getProducts());
  cartItems: Signal<CartItem[]> = this.store.selectSignal(CartState.getCartItems);
  totalPrice = this.store.selectSignal(CartState.getTotalPrice);

  addToCart($event: any) {
    this.store.dispatch(new CartActions.AddToCart($event));
  }

  checkout() {}
}
