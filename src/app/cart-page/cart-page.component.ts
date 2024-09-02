import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cartData: cart[] | undefined;

  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    taxy: 0,
    delivery: 0,
    total: 0,
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: string | undefined) {
    cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe((result) => {
        this.loadDetails();
      })
  }

  loadDetails() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity);
        }
      });
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 50;
      this.priceSummary.taxy = price / 20;
      this.priceSummary.delivery = 25;
      this.priceSummary.total = price + (price / 20) + 25 - (price / 50);
      if (!this.cartData.length) {
        this.router.navigate(['/'])
      }
    })
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }

}