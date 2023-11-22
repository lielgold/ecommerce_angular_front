import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BACK_URL, Product, SharedService} from '../../shared.module';
import { RouterLink } from '@angular/router';
import { inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent{
  shopping_cart_products: Product[];
  sharedService = inject(SharedService);

  constructor(private httpClient: HttpClient , public dialog: MatDialog){
    this.shopping_cart_products = this.sharedService.getShoppingCart()
  }

  // get the total price of the products
  totalPrice(): number {
    return this.sharedService.shopping_cart.reduce((sum, product) => sum + product.price, 0);
  }

  openDialog(product: Product): void {        
    const dialogRef = this.dialog.open(ProductDialogComponent, {            
      data: {product:product, dialog_type:"shopping_cart"},      
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed with result:', result);
    });
  }    

}
