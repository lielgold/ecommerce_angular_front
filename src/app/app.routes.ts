import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { WishListComponent } from './components/wish-list/wish-list.component';

export const routes: Routes = [
    // example:
    { path: '', component: ProductsListComponent }, 
    // { path: 'about', component: AboutComponent },
    // { path: 'contact', component: ContactComponent },
    { path: 'shopping_cart', component: ShoppingCartComponent }, 
    { path: 'wish_list', component: WishListComponent }, 

];