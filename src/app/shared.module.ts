
export const BACK_URL = 'http://localhost:3000';
import {Injectable} from '@angular/core';

export interface Product {
    _id: number;
    name: string;
    price: number;
    description: string;
    category: 'yellow' | 'red' | 'blue';
  }

@Injectable({
providedIn: 'root',
})
export class SharedService {    
    shopping_cart: Product[] = [];

    // add a product to the shopping cart
    addProductToCart(product:Product):void{
        this.shopping_cart.push(product);
    }

    // remove a product from the shopping cart by id
    removeProductFromCartByID(productID: number): void {
        const indexToRemove = this.shopping_cart.findIndex(
        (product) => product._id === productID
        );

        if (indexToRemove !== -1) {
        this.shopping_cart.splice(indexToRemove, 1);
        }
    }
    
  // Remove all products from the shopping cart
  removeAllProductsFromCart(): void {
    while(this.shopping_cart.length!==0){
        this.shopping_cart.pop();
    }
  }    

    // Getter to retrieve the current shopping cart
    getShoppingCart(): Product[] {
        return this.shopping_cart;
    }

  // Check if a product is in the shopping cart
  isProductInCart(productID: number): boolean {
    for(const p of this.shopping_cart){
        if (p._id===productID){
            // TODO add an alert to the user that the product is already in the cart
            return true;
        }
    }
    return false;
  }    
}