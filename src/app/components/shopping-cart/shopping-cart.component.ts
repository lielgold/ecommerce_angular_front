import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BACK_URL, Product, SharedService} from '../../shared.module';
import { RouterLink } from '@angular/router';
import { inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent{
  shopping_cart_products: Product[];
  sharedService = inject(SharedService);

  constructor(private httpClient: HttpClient){
    this.shopping_cart_products = this.sharedService.getShoppingCart()
  }

  // remove product from catalog to shopping cart
  removeProductFromShoppingCart(product_id:number): void {
    this.sharedService.removeProductFromCartByID(product_id);
  }  

  // Buy all products in the shopping cart
  checkout(): void {
    const id_products_to_buy: number[] = this.shopping_cart_products.map(p => p._id);

    //this.httpClient.post(BACK_URL + '/checkout', {productIds: id_products_to_buy }).subscribe(
    this.httpClient.post(BACK_URL + '/checkout/',{ productIds: id_products_to_buy }).subscribe(
      () => {
        console.log('checkout successful');
        this.sharedService.removeAllProductsFromCart();
        //this.sharedService.removeAllProductsFromCart();
        // TODO show an alert to the user the he bought the items
      },
      (error) => {
        console.error('Error during checkout:', error);        
      }
    );
  }  

}
