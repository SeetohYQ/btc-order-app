import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Order } from './models';
import { FormGroup } from '@angular/forms';
import { environment } from './../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order = new Order('', '', '', null, null, null, null, 0);
  serverUrl = environment.SERVER_URI;
  onAdd = new EventEmitter<void>();

  constructor(private httpSvc: HttpClient) { }

  confirmOrder(orderForm: FormGroup, label: number) {
    this.order.name = orderForm.get('name').value;
    this.order.phoneNumber = orderForm.get('phoneNumber').value;
    this.order.gender = orderForm.get('gender').value;
    this.order.dob = orderForm.get('dob').value;
    this.order.orderDate = orderForm.get('orderDate').value;
    this.order.orderType = orderForm.get('orderType').value;
    this.order.units = orderForm.get('units').value;
    this.order.label = label;
    
    const orderObj = {
      name: orderForm.get('name').value,
      phoneNumber: orderForm.get('phoneNumber').value,
      gender: orderForm.get('gender').value,
      dob: (<Date>orderForm.get('dob').value).getTime(),
      orderDate: (<Date>orderForm.get('orderDate').value).getTime(),
      orderType: orderForm.get('orderType').value,
      units: orderForm.get('units').value,
      label: label
    };

    this.httpSvc.post(this.serverUrl + 'order/', orderObj).toPromise()
      .then((res) => {
        console.log(res);
        this.onAdd.emit();
      }).catch((err) => {
        console.log(err);
      });
  }

  updateOrder(orderForm: FormGroup, index: number) {
    const orderObj = {
      name: orderForm.get('name').value,
      phoneNumber: orderForm.get('phoneNumber').value,
      gender: orderForm.get('gender').value,
      dob: (<Date>orderForm.get('dob').value).getTime(),
      orderDate: (<Date>orderForm.get('orderDate').value).getTime(),
      orderType: orderForm.get('orderType').value,
      units: orderForm.get('units').value,
      label: 0
    };
    
    this.httpSvc.put(this.serverUrl + 'order/' + index.toString(), orderObj).subscribe((response)=>{
        return response;
      }, 
      (error)=> {
        console.log(error);
      });
  }

  getOrders() {
    return this.httpSvc.get<{string: Order[]}>(this.serverUrl + 'order/');
  }

  getOrderDetails() {
    return this.order;
  }

  getBtcPrice(): Promise<any> {

    // const params = new HttpParams()
    //   .set('crypto', this.crypto)
    //   .set('fiat', this.fiat);

    // const headers = new HttpHeaders()
    //   .set('Content-Type', 'application/json')
    //   .set('X-testing', 'testing')
    //   .set('X-Requested-With', 'XMLHttpRequest');

    return this.httpSvc.get(this.serverUrl + 'mktdata/price')
      .toPromise();
  }

  retrieveOrder(index: number) {  
    return this.httpSvc.get<{string: Order}>(this.serverUrl + 'order/' + index.toString()).toPromise();
  }
}
