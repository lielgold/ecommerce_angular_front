import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BACK_URL, Product} from '../../shared.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  products?: Product[];

}
