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
  product:Product;
  dialog_type:string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product, dialog_type: string }, public dialogRef: MatDialogRef<ProductDialogComponent>) {
    this.product=data.product;
    this.dialog_type=data.dialog_type;
  }

  addToWishlist(): void {    
    this.sharedService.addProductFromCatalogToWishList(this.data.product._id);
    this.dialogRef.close({ result: "product added to wish list" });
  }

  addToShoppingCart(): void {  
    this.sharedService.addProductFromCatalogToShoppingCart(this.data.product._id);
    this.dialogRef.close({ result: "product added to shopping cart" });
  }

  removeFromCatalog(): void {    
    this.sharedService.removeProductFromCatalog(this.data.product._id);
    this.dialogRef.close({ result: "product removed from catalog" });
  }

  checkoutProduct(): void {    
    this.sharedService.checkout([this.data.product._id]);    
    this.dialogRef.close({ result: "bought product" });
  }

  removeProductFromWIshList(): void {    
    this.sharedService.removeProductFromWishListByID(this.data.product._id);    
    this.dialogRef.close({ result: "product removed from wish list" });
  }

  MoveProductToCart(): void {    
    this.sharedService.moveProductFromWishListToCart(this.data.product._id);
    this.dialogRef.close({ result: "product moved from wish list to cart" });
  }    

  closeTheDialog():void{
    this.dialogRef.close({ result: "User logs in" })
  }

}
