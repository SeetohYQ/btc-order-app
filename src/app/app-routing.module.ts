import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './components/order.component';
import { ConfirmOrderComponent } from './components/confirm-order.component';


const routes: Routes = [
  
  { path: '', component: OrderComponent},
  { path: 'order', component: OrderComponent},
  { path: 'order/confirm', component: ConfirmOrderComponent},
  { path: '**', redirectTo:'order'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
