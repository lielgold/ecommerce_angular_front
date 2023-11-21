
export const BACK_URL = 'http://localhost:3000';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
    token: string;  
    isUserAdmin: string;
  }

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
    isUserAdmin:boolean=false;
    isLoggedIn:boolean=false;
    loggedUsername:string='';

    constructor(private httpClient: HttpClient, private router: Router){        
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

    // add product to catalog
    addProductToCatalog(newProduct:Product):void{        
        this.httpClient.post(BACK_URL + '/products/', newProduct).subscribe(
            (data) => {
              console.log('Product added successfully:', data);
              this.fetchProductData();
            },
            (error) => {
              console.error('Error adding new product:', error);
            }
        );
    }

    // remove the product from the catalog, only available to admin
    removeProductFromCatalog(productID:number): void {
        this.httpClient.post(BACK_URL + `/remove/${productID}`, {}).subscribe(
            (data) => {
              console.log('Product deleted successfully:', data);
              this.fetchProductData();
            },
            (error) => {
              console.error('Error deleting product:', error);
            }
          );
    }

  // add product from catalog to shopping cart
  // if use_wish_list_instead===true -> add the product to the wish list instead
  addProductFromCatalogToShoppingCart(product_id:number, use_wish_list_instead:boolean=false): void {
    if(this.products_list.length===0) return;
    if(this.isProductInCart(product_id) && use_wish_list_instead===false) return;
    else if(this.isProductInWishList(product_id) && use_wish_list_instead===true) return;

    for (const p of this.products_list) {
      if (p._id === product_id) {
        if(use_wish_list_instead) this.addProductToWishList(p);        
        else this.addProductToCart(p);
        break;
      }
    }
  }

  // add product from catalog to shopping list  
  addProductFromCatalogToWishList(product_id:number, use_wish_list_instead:boolean=false): void {
    this.addProductFromCatalogToShoppingCart(product_id,true);
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

      // login to user account
      login(username:string, password:string){
        const loginData = {
            username: username,
            password: password
          };
    
          // Assuming there's a login endpoint on your backend
          this.httpClient.post<LoginResponse>(BACK_URL + '/login/', loginData).subscribe(
            (data) => {
              console.log('Login successful:', data);          
              // Save token to localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('isUserAdmin', data.isUserAdmin);
              localStorage.setItem('username', username);
              this.update_login_status();
              //console.log('Token from localStorage:', localStorage.getItem('token'));
              // Handle successful login, e.g., redirect to a new page          
            },
            (error) => {
              console.error('Error logging in:', error);
              // Handle login error, e.g., display an error message
            }
          ); 
      }

      // register a new account
      register(username:string, password:string, retype_password:string){
        const registerData = {
            username: username,
            password: password,
            retype_password: retype_password
          };
    
          // Assuming there's a login endpoint on your backend
          this.httpClient.post<LoginResponse>(BACK_URL + '/register/', registerData).subscribe(
            (data) => {
              console.log('Registration successful:', data);
              console.log('token:', data.token);
              console.log('isUserAdmin:', data.isUserAdmin);
              localStorage.setItem('token', data.token);
              localStorage.setItem('isUserAdmin', data.isUserAdmin);
              localStorage.setItem('username', username);
              this.update_login_status();              
              // TODO add a succesful logged in message              
            },
            (error) => {
              console.error('Error logging in:', error);
              // TODO Handle login error, e.g., display an error message
            }
          ); 
      }        

    update_login_status(){
        if(localStorage.getItem('token')!=='') this.isLoggedIn = true;
        else this.isLoggedIn = false;

        if(localStorage.getItem('isUserAdmin')=='true') this.isUserAdmin = true;
        else this.isUserAdmin = false;

        if(localStorage.getItem('username')!=='') {
            const n = localStorage.getItem('username');
            if (n!=null) this.loggedUsername = n;
        }
        else this.loggedUsername = "";
    }

  // Logout function
  logout(): void {
    // clean login
    localStorage.setItem('token', '');
    localStorage.setItem('isUserAdmin', '');
    localStorage.setItem('username', '');
    this.update_login_status();
    this.wish_list = [];
    this.shopping_cart = [];    

    this.httpClient.post(BACK_URL + '/logout', {}).subscribe(
      () => {
        console.log('Logout successful');
        //this.router.navigate(['/']); // Navigate to the root route
      },
      (error) => {
        console.error('Error during logout:', error);
        // Handle logout error
      }
    );
  }

  // Buy all products with the given id
  checkout(products_id:number[]): void {
    //this.httpClient.post(BACK_URL + '/checkout', {productIds: id_products_to_buy }).subscribe(
    this.httpClient.post(BACK_URL + '/checkout/',{ productIds: products_id }).subscribe(
      () => {
        console.log('checkout successful');
        for(const id of products_id){
          this.removeProductFromCartByID(id);
        };        
        //this.sharedService.removeAllProductsFromCart();
        // TODO show an alert to the user the he bought the items
      },
      (error) => {
        console.error('Error during checkout:', error);        
      }
    );
  }  

  // Buy all products with the given id
  checkout_all(): void {
    const id_products_to_buy: number[] = this.shopping_cart.map(p => p._id);
    this.checkout(id_products_to_buy);
  }    

  

}