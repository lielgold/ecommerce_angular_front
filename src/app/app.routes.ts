import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';

export const routes: Routes = [
    // example:
    { path: '', component: ProductsListComponent }, 
    { path: 'about', component: AboutPageComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'shopping_cart', component: ShoppingCartComponent }, 
    { path: 'wish_list', component: WishListComponent }, 

];