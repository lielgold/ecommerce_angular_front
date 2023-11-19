import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../shared.module';

import { MatDialogContent, MatDialogModule  } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent {  
  constructor(@Inject(MAT_DIALOG_DATA) public product_data: Product) {
  }

}
