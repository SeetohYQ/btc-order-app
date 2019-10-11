import { Component, OnInit } from '@angular/core';
import { Order } from '../models';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  order: Order;
  custodianWalletAddress = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

  constructor(private orderSvc: OrderService, private router: Router) { }

  ngOnInit() {
    this.order = this.orderSvc.getOrderDetails();
  }

}
