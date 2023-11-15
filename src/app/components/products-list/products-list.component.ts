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
  products?: Product[];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchProductData();
  }

  fetchProductData(): void {
    console.log("inside fetchProductData");
    this.httpClient.get('http://localhost:3000/products/').subscribe(
      (data) => {
        console.log(data);
        this.products = data as Product[];
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }
}