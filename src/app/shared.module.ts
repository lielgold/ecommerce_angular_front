
export const BACK_URL = 'http://localhost:3000';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

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
    products_list: Product[] = [];
    filtered_products_list: Product[] = [];
    shopping_cart: Product[] = [];
    wish_list: Product[] = [];

    constructor(private httpClient: HttpClient){        
    }    

    fetchProductData(): void {
        this.httpClient.get(BACK_URL + '/products/').subscribe(
            (data) => {
            this.products_list = data as Product[];
            this.filtered_products_list = data as Product[];
            },
            (error) => {
            console.error('Error fetching product data:', error);
            }
        );
    }   
       

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

    // add a product to the shopping cart
    addProductToWishList(product:Product):void{
        this.wish_list.push(product);
    }
    // remove a product from the shopping cart by id
    removeProductFromWishListByID(productID: number): void {
        const indexToRemove = this.wish_list.findIndex(
        (product) => product._id === productID
        );

        if (indexToRemove !== -1) {
        this.wish_list.splice(indexToRemove, 1);
        }
    }    
    // Remove all products from the shopping cart
    removeAllProductsFromWishList(): void {
        while(this.wish_list.length!==0){
            this.wish_list.pop();
        }
    }    
    // Getter to retrieve the current shopping cart
    getWishList(): Product[] {
        return this.wish_list;
    }
    // Check if a product is in the shopping cart
    isProductInWishList(productID: number): boolean {
        for(const p of this.wish_list){
            if (p._id===productID){
                // TODO add an alert to the user that the product is already in the wish list                
                return true
            }
        }   
        return false;     
    }

    moveProductFromWishListToCart(productID: number): void {
        const productIndex = this.wish_list.findIndex(p => p._id === productID);
    
        if (productIndex !== -1) {
          const product = this.wish_list[productIndex];
    
          // Check if the product is already in the shopping cart
          const isProductInCart = this.shopping_cart.some(p => p._id === product._id);
    
          if (!isProductInCart) {
            this.shopping_cart.push(product);
            this.wish_list.splice(productIndex, 1);
    
            // TODO: Add an alert to the user that the product is moved to the cart
            console.log('Product moved to the cart:', product);
          } else {
            // TODO: Add an alert to the user that the product is already in the cart
            console.log('Product is already in the cart:', product);
          }
        } else {
          // TODO: Add an alert to the user that the product was not found in the wish list
          console.log('Product not found in the wish list:', productID);
        }
      }

      // update filter_products_list to only contain those that contain the search string
      filterProducts(searchTerm: string): void {
        // Use lowercase for case-insensitive search
        const filterValue = searchTerm ? searchTerm.toLowerCase() : '';
      
        // Filter products based on the search term
        this.filtered_products_list = this.products_list.filter((product) =>
          product.name.toLowerCase().includes(filterValue)
        );
      }
      // reset the filter
      resetFilter():void{
        this.filtered_products_list = [...this.products_list];
      }

}