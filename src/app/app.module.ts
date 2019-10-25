import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.modules';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderComponent } from './components/order.component';
import { ConfirmOrderComponent } from './components/confirm-order.component';
import { OrderService } from './order.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { EditOrderComponent } from './components/edit-order.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    ConfirmOrderComponent,
    EditOrderComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
