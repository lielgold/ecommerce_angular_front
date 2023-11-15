import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})

export class ProductsListComponent implements OnInit {
  products: Product[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchProductData();
  }

  fetchProductData(): void {
    this.httpClient.get('/get_product_data/').subscribe(
      (value) => {
        //this.products = value;
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }
}