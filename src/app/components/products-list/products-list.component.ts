import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { BACK_URL, Product, SharedService } from '../../shared.module';
import { inject} from '@angular/core';

interface LoginResponse {
  token: string;  
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})

export class ProductsListComponent implements OnInit {
  products?: Product[];
  productForm: FormGroup;
  loginForm: FormGroup;
  sharedService = inject(SharedService);

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      description: ['', Validators.required],
      category: ['yellow', Validators.required]
    });

    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });    
  }

  ngOnInit(): void {
    this.fetchProductData();
  }

  fetchProductData(): void {
    this.httpClient.get(BACK_URL + '/products/').subscribe(
      (data) => {
        this.products = data as Product[];
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        _id: 0,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        category: this.productForm.value.category
      };

      this.httpClient.post(BACK_URL + '/products/', newProduct).subscribe(
        (data) => {
          console.log('Product added successfully:', data);
          this.fetchProductData();
        },
        (error) => {
          console.error('Error adding new product:', error);
        }
      );

      this.productForm.reset();
    }
  }

  deleteProduct(productName: string): void {
    // Assuming there's an endpoint on your backend to handle product deletion
    this.httpClient.post(BACK_URL + `/remove/${productName}`, {}).subscribe(
      (data) => {
        console.log('Product deleted successfully:', data);
        this.fetchProductData();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  // Login function
  login(): void {
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      // Assuming there's a login endpoint on your backend
      this.httpClient.post<LoginResponse>(BACK_URL + '/login/', loginData).subscribe(
        (data) => {
          console.log('Login successful:', data);          
          // Save token to localStorage
          localStorage.setItem('token', data.token);
          //console.log('Token from localStorage:', localStorage.getItem('token'));
          // Handle successful login, e.g., redirect to a new page          
        },
        (error) => {
          console.error('Error logging in:', error);
          // Handle login error, e.g., display an error message
        }
      );

      // Reset the login form after submission
      this.loginForm.reset();
    }
  }

  // Logout function
  logout(): void {
    localStorage.setItem('token', '');
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

  // Restricted test
  restricted_test(): void {    
    this.httpClient.get(BACK_URL + '/restricted_test', {}).subscribe(
      () => {
        console.log('restricted_test successful');        
      },
      (error) => {
        console.error('Error during restricted_test:', error);        
      }
    );
  }

  // add product from catalog to shopping cart
  // if use_wish_list_instead===true -> add the product to the wish list instead
  addProductFromCatalogToShoppingCart(product_id:number, use_wish_list_instead:boolean=false): void {
    if(this.products === undefined) return;
    if(this.sharedService.isProductInCart(product_id) && use_wish_list_instead===false) return;
    else if(this.sharedService.isProductInWishList(product_id) && use_wish_list_instead===true) return;

    for (const p of this.products) {
      if (p._id === product_id) {
        if(use_wish_list_instead) this.sharedService.addProductToWishList(p);        
        else this.sharedService.addProductToCart(p);
        break;
      }
    }
  }
}
