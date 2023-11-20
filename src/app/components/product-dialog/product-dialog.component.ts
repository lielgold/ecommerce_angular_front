import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../shared.module';

import { MatDialogContent, MatDialogModule  } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { inject} from '@angular/core';
import { SharedService } from '../../shared.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent {
  sharedService = inject(SharedService);
  
  constructor(@Inject(MAT_DIALOG_DATA) public product_data: Product, public dialogRef: MatDialogRef<ProductDialogComponent>) {
  }

  addToWishlist(): void {    
    this.sharedService.addProductFromCatalogToWishList(this.product_data._id)
    this.dialogRef.close({ result: "product added to wish list" })
  }

  addToShoppingCart(): void {  
    this.sharedService.addProductFromCatalogToShoppingCart(this.product_data._id)
    this.dialogRef.close({ result: "product added to shopping cart" })
  }

  removeFromCatalog(): void {    
    this.sharedService.removeProductFromCatalog(this.product_data._id)
    this.dialogRef.close({ result: "product removed from catalog" })
  }

  closeTheDialog():void{
    this.dialogRef.close({ result: "User logs in" })
  }

}
