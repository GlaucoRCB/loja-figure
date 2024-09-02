import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartData:cart[]|undefined;
  totalPrice:number|undefined;
  orderMsg:string|undefined;
  payment:string;
  payMetods: string[] = ['MasterCard', 'Visa', 'Pix', 'Boleto'];

  constructor(private product:ProductService, private router:Router) { 
    this.payment = this.payMetods[0];
  }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result)=>{
      let price=0;
      this.cartData=result;
      result.forEach((item)=>{
        if(item.quantity){
          price = price + (+item.price* +item.quantity);
        }
      });
      this.totalPrice=price+(price/20)+25-(price/50);
    })
  }

  orderNow(data:order){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    let pay = this.payment;
    
    if(this.totalPrice) {
      let orderData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
        pay,
        id:undefined
      }

      this.cartData?.forEach((item)=>{
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id)

        }, 700);
      })
      this.product.orderNow(orderData).subscribe((result)=>{
        if(result){
          this.orderMsg="Seu pedido foi realizado com sucesso!"

          setTimeout(() => {
            this.router.navigate(['/my-orders'])
            this.orderMsg=undefined;  
          }, 3500);
        }
      })
    }
  }

}
