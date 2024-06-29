import { CartItem } from "./cart.model";
const ACTION_SCOPE = '[Cart]';

export namespace CartActions {
  export class AddToCart {
    static readonly type = `${ACTION_SCOPE} Add`;
    
    constructor(public cartItem: CartItem) {}
  }

  export class UpdateCart {
    static readonly type = `${ACTION_SCOPE} Update`;
    
    constructor(public cartItem: CartItem) {}
  }
  
  export class RemoveFromCart {
    static readonly type = `${ACTION_SCOPE} Remove`;
    
    constructor(public cartItem: CartItem) {}
  }
}