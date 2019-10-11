import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Order } from './models';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  crypto = 'BTC';
  fiat = 'SGD';
  apiUrl = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/all';
  order = new Order('','','',null,null,null,null, 0);

  constructor(private httpSvc: HttpClient) { }

  confirmOrder(orderForm: FormGroup, label: number){
    this.order.name = orderForm.get('name').value;
    this.order.phoneNumber = orderForm.get('phoneNumber').value;
    this.order.gender = orderForm.get('gender').value;
    this.order.dob = orderForm.get('dob').value;
    this.order.orderDate = orderForm.get('orderDate').value;
    this.order.orderType = orderForm.get('orderType').value;
    this.order.units = orderForm.get('units').value;
    this.order.label = label;
  }

  getOrderDetails(){
    return this.order;
  }

  getBtcPrice(): Promise<any> {

    const params = new HttpParams()
    .set('crypto', this.crypto)
    .set('fiat', this.fiat);

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-testing', 'testing')
    .set('X-Requested-With', 'XMLHttpRequest');

    return this.httpSvc.get(this.apiUrl, {params: params, headers: headers})
      .toPromise();
  }
}
