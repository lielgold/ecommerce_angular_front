
export const BACK_URL = 'http://localhost:3000';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from './components/alert/alert.component';


interface LoginResponse {
    token: string;  
    isUserAdmin: string;
  }

export interface Product {
    _id: number;
    name: string;
    price: number;
    description: string;
    category: 'yellow' | 'red' | 'orange';
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

    constructor(private httpClient: HttpClient, private router: Router, public dialog: MatDialog){        
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
              //console.log('Product added successfully:', data);
              this.showAlert("Product added successfully", "", "success");
              this.fetchProductData();
            },
            (error) => {
              //console.error('Error adding new product:', error);
              this.showAlert("Error adding new product", "", "warning");
            }
        );
    }

    // remove the product from the catalog, only available to admin
    removeProductFromCatalog(productID:number): void {
        this.httpClient.post(BACK_URL + `/remove/${productID}`, {}).subscribe(
            (data) => {
              //console.log('Product deleted successfully:', data);
              this.showAlert("Product deleted successfully", "", "success");
              this.fetchProductData();
            },
            (error) => {
              //console.error('Error deleting product:', error);
              this.showAlert("Error deleting product", "", "warning");
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
                this.showAlert("The product is already in the cart", "", "information")                 
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
                this.showAlert("The product is already in the wish list", "Thanks!", "information");
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
            
            this.showAlert("Product moved to the cart: " + product.name, "", "information")        
          } else {            
            this.showAlert("Product is already in the cart: " + product.name, "", "information")                    
          }
        } else {                    
          this.showAlert("Product not found in the wish list: " + productID, "", "warning")        
        }
      }

      // update filter_products_list to only contain those that contain the search string
      filterProducts(searchTerm: string, category:string): void {
        // Use lowercase for case-insensitive search
        const filterValue = searchTerm ? searchTerm.toLowerCase() : '';
      
        // Filter products based on the search term
        this.filtered_products_list = this.products_list.filter((product) =>
          product.name.toLowerCase().includes(filterValue) &&
          (category === 'all' || product.category.toLowerCase() === category.toLowerCase())
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
              //console.log('Login successful:', data);          
              // Save token to localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('isUserAdmin', data.isUserAdmin);
              localStorage.setItem('username', username);
              this.update_login_status();
              //console.log('Token from localStorage:', localStorage.getItem('token'));
              // Handle successful login, e.g., redirect to a new page  
              this.showAlert("Login successful", "", "success");
                      
            },
            (error) => {
              //console.error('Error logging in:', error);
              this.showAlert("Error logging in", "", "warning");              
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
              //console.log('Registration successful:', data);              
              localStorage.setItem('token', data.token);
              localStorage.setItem('isUserAdmin', data.isUserAdmin);
              localStorage.setItem('username', username);
              this.update_login_status();
              this.showAlert("Registration successful", "", "success");                     
            },
            (error) => {              
              console.error('Registration error:', error);
              this.showAlert("Registration error", "", "warning");
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
        //console.log('Logout successful');
        this.showAlert("Logout successful", "", "success");        
      },
      (error) => {
        //console.error('Error during logout:', error);
        this.showAlert("Error during logout", "", "warning");        
      }
    );
  }

  // Buy all products with the given id
  checkout(products_id:number[]): void {
    //this.httpClient.post(BACK_URL + '/checkout', {productIds: id_products_to_buy }).subscribe(
    this.httpClient.post(BACK_URL + '/checkout/',{ productIds: products_id }).subscribe(
      () => {
        //console.log('checkout successful');
        for(const id of products_id){
          this.removeProductFromCartByID(id);
        };                        
        this.showAlert("Purchase Complete", "Thanks!", "success");
      },
      (error) => {
        //console.error('Error during checkout:', error);
        this.showAlert("Error during checkout", "", "warning");
      }
    );
  }  

  // Buy all products with the given id
  checkout_all(): void {
    const id_products_to_buy: number[] = this.shopping_cart.map(p => p._id);
    if(id_products_to_buy.length===0) return;
    this.checkout(id_products_to_buy);
  }

  // Function to open the alert dialog
  showAlert(title: string, message: string, alertType:string): void {
    const dialogConfig = new MatDialogConfig();

    // Configure the dialog settings    
    dialogConfig.panelClass = 'custom-dialog-class'; // Optional: Add a custom CSS class for styling

    // Set the data to be passed to the dialog
    dialogConfig.data = { title, message, alertType };

    // Open the dialog
    const dialogRef = this.dialog.open(AlertComponent, dialogConfig);    
  }

  // get an image source based on the category of the product
  // should be removed when adding support for images on the backend
  get_image_source(product_category:string):string{
    if(product_category==='orange'){
      return "assets/images/orange.jpg";
    }
    else if(product_category==='yellow'){
      return "assets/images/lemon.jpg";
    }
    else if(product_category==='red'){
      return "assets/images/pomegranate.jpg";
    }    
    throw new Error('Invalid product category: ' + product_category);
  }

}