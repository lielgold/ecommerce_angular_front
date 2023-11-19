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
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent{
  wish_list_products: Product[];
  sharedService = inject(SharedService);

  constructor(private httpClient: HttpClient){
    this.wish_list_products = this.sharedService.getWishList()
  }

  // remove product from catalog to shopping cart
  removeProductFromWishList(product_id:number): void {
    this.sharedService.removeProductFromWishListByID(product_id);
  }    

  // move product from wish list to shopping cart
  AddProductToCart(product_id:number): void {    
    this.sharedService.moveProductFromWishListToCart(product_id);
  }

  // move all products from wish list to shopping cart
  AddAllProductsToCart(): void {
    // Reverse the wish_list_products array
    const reversedWishList = this.wish_list_products.slice().reverse();
  
    // Iterate over the reversed array
    for (const product of reversedWishList) {
      this.sharedService.moveProductFromWishListToCart(product._id);
    }
  }

  // get the total price of the products
  totalPrice(): number {
    return this.wish_list_products.reduce((sum, product) => sum + product.price, 0);
  }  

}
