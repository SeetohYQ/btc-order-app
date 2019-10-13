import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { OrderService } from '../order.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup;
  label: number;
  unitPrice: number = 11180;
  todayDate = moment().startOf('day').toDate();
  defaultUnits = 0.001;
  yourWalletAddress = 'qdm5fwzztg95er9wndyl346l5yvkfx7rrrs0raq1cb'
  defaultOption = 'buy';

  constructor(private orderSvc: OrderService, private router: Router) { }

  ngOnInit() {
    this.orderForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      'phoneNumber': new FormControl(null, [Validators.required, this.validateSgNumber]),
      'gender': new FormControl(null, Validators.required),
      'dob': new FormControl(null, [Validators.required,this.validateDob]),
      'orderDate': new FormControl(this.todayDate, [Validators.required,this.validateOrderDate]),
      'orderType': new FormControl(this.defaultOption),
      'units': new FormControl(this.defaultUnits, [Validators.required, this.validateUnit.bind(this)])
    });
    this.unitPrice = this.getBTCPrice(this.orderForm.get['orderType']);
    this.label = this.defaultUnits * this.unitPrice;
  }

  processOrder() {
    this.label = this.orderForm.get('units').value * this.unitPrice;

    //To update label
    this.orderSvc.confirmOrder(this.orderForm, this.label);
    this.router.navigate(['order','confirm'])
  }

  getBTCPrice(option: string) {
    this.orderSvc.getBtcPrice().then((result) => {
      if (option === 'buy'){
        this.unitPrice = result.BTCSGD.ask;
        this.label = this.orderForm.get('units').value * this.unitPrice;
      }
      else{
        this.unitPrice = result.BTCSGD.bid;
        this.label = this.orderForm.get('units').value * this.unitPrice;
      }
    }).catch((error) => {
      if (option === 'sell'){
        this.unitPrice = 10180;
        this.label = this.orderForm.get('units').value * this.unitPrice;
      }
      else if (option === 'buy'){
        this.unitPrice = 11180;
        this.label = this.orderForm.get('units').value * this.unitPrice;
      }
    })
    return this.unitPrice;
  }

  updateTotal(event: any){
    this.label = this.orderForm.get('units').value * this.unitPrice;
  }

  updatePayment(){
    this.defaultOption = this.orderForm.get('orderType').value; 
    this.unitPrice = this.getBTCPrice(this.defaultOption);

    // setTimeout(()=>{  
    //   console.log(this.unitPrice)
    // },2000)
  }

  resetForm(){
    this.orderForm.reset();
    this.orderForm.patchValue({
      orderDate: this.todayDate,
      orderType: this.defaultOption,
      units: this.defaultUnits,
      });
  }

  validateUnit(control: FormControl): ValidationErrors {

    if (control.value < 0){
      return {invalidQtyError : 'Invalid quantity'};
    }
    return null;
  }

  validateDob(control: FormControl): ValidationErrors {

    const dateOfBirth = control.value;
    const currentAge = moment().diff(dateOfBirth, 'years');
    if (currentAge < 21) {
      return {ageRequirement : 'Must be at least 21 years old'};
    }
    return null;
  }

  
  validateOrderDate(control: FormControl): ValidationErrors {

    if (control.value < moment().startOf('day')) {
      return {orderDate : 'Cannot be earlier than today'};
    }
    return null;
  }

  validateSgNumber(control: FormControl): ValidationErrors {

    const num = control.value || '0';
    if (num.length !== 8) {
      return {notSgNumber : 'Not a valid Singapore number'};
    }
    else if (num.length === 8 && (num[0]  !== '8' && num[0]  !== '9' && num[0]  !== '6')){
      return {wrongFirstDigit : 'Not a valid Singapore number'};
    }
    return null;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.orderForm.controls[controlName].hasError(errorName);
  }

}