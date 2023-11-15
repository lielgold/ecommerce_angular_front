import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: 'yellow' | 'red' | 'blue';
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})

export class ProductsListComponent implements OnInit {
  products?: Product[];
  productForm: FormGroup;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      description: ['', Validators.required],
      category: ['yellow', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProductData();
  }

  fetchProductData(): void {
    this.httpClient.get('http://localhost:3000/products/').subscribe(
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
        id: 0,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        category: this.productForm.value.category
      };

      this.httpClient.post('http://localhost:3000/products/', newProduct).subscribe(
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
    this.httpClient.post(`http://localhost:3000/remove/${productName}`, {}).subscribe(
      (data) => {
        console.log('Product deleted successfully:', data);
        this.fetchProductData();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }
}
