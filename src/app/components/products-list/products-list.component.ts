import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { Product, SharedService } from '../../shared.module';
import { inject} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})

export class ProductsListComponent implements OnInit{  
  productForm: FormGroup;  
  sharedService = inject(SharedService);
  searchForm: FormGroup;  

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      description: ['', Validators.required],
      category: ['yellow', Validators.required]
    });

    // Initialize the search form
    this.searchForm = this.formBuilder.group({
      search_string: ['', Validators.required],
    });    
    
  }

  ngOnInit(): void {    
    if(this.sharedService.products_list.length===0) this.sharedService.fetchProductData();
  }

  onSubmitNewProductForm(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        _id: 0,
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        category: this.productForm.value.category
      };

      this.sharedService.addProductToCatalog(newProduct);
      this.productForm.reset();
    }
  }

  // Modify filterProducts to use this.search_value
  filterProducts(): void {
    // Use lowercase for case-insensitive search
    const filterValue = this.searchForm.value.search_string.toLowerCase();
    if (filterValue==='') {
      this.sharedService.resetFilter();
    }

    // Filter products based on the search term
    this.sharedService.filterProducts(filterValue);
  }

  openDialog(product: Product): void {        
    const dialogRef = this.dialog.open(ProductDialogComponent, {            
      data: {product:product, dialog_type:"product_list"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed with result:', result);
    });
  }  
}
