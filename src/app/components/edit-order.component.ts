import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { OrderService } from '../order.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../models';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  editOrderForm: FormGroup;
  order: Order;
  label: number;
  index: number;
  originalUnitPrice: number;

  constructor(private orderSvc: OrderService, private route: ActivatedRoute, private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.index = +this.route.snapshot.paramMap.get('id');
    this.editOrderForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      'phoneNumber': new FormControl(null, [Validators.required, this.validateSgNumber]),
      'gender': new FormControl(null, Validators.required),
      'dob': new FormControl(null, [Validators.required, this.validateDob]),
      'orderDate': new FormControl(null),
      'orderType': new FormControl(null),
      'units': new FormControl(null, [Validators.required, this.validateUnit.bind(this)])
    });

    this.orderSvc.retrieveOrder(this.index).then(response => {
      this.order = response['selectedOrder'];
      this.editOrderForm.get('name').setValue(this.order.name); 
      this.editOrderForm.get('phoneNumber').setValue(this.order.phoneNumber);
      this.editOrderForm.get('gender').setValue(this.order.gender);
      this.editOrderForm.get('dob').setValue(new Date(this.order.dob));
      this.editOrderForm.get('orderDate').setValue(new Date(this.order.dob));
      this.editOrderForm.get('orderType').setValue(this.order.orderType);
      this.editOrderForm.get('units').setValue(this.order.units);
      this.label = this.order.label;
      this.originalUnitPrice = this.label / this.order.units;
    });
  }
  
  processUpdate() {
    this.orderSvc.updateOrder(this.editOrderForm, this.index);

    this._snackBar.open('Order Updated', 'Ok', {
      duration: 3000
    });

    this.router.navigate(['order','confirm']);
  }

  updateTotal() {
    this.label =  this.editOrderForm.get('units').value *  this.originalUnitPrice;
  }

  validateUnit(control: FormControl): ValidationErrors {

    if (control.value < 0) {
      return { invalidQtyError: 'Invalid quantity' };
    }
    return null;
  }

  validateDob(control: FormControl): ValidationErrors {

    const dateOfBirth = control.value;
    const currentAge = moment().diff(dateOfBirth, 'years');
    if (currentAge < 21) {
      return { ageRequirement: 'Must be at least 21 years old' };
    }
    return null;
  }

  validateOrderDate(control: FormControl): ValidationErrors {

    if (control.value < moment().startOf('day')) {
      return { orderDate: 'Cannot be earlier than today' };
    }
    return null;
  }

  validateSgNumber(control: FormControl): ValidationErrors {

    const num = control.value || '0';
    if (num.length !== 8) {
      return { notSgNumber: 'Not a valid Singapore number' };
    }
    else if (num.length === 8 && (num[0] !== '8' && num[0] !== '9' && num[0] !== '6')) {
      return { wrongFirstDigit: 'Not a valid Singapore number' };
    }
    return null;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.editOrderForm.controls[controlName].hasError(errorName);
  }
}
