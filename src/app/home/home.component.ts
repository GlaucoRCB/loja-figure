import { Component, OnInit, ViewChild } from '@angular/core';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
		
  popularProducts:undefined | product[];
  hotProducts:undefined | product[];
  
  productData:undefined | product;
  productQuantity:number=1;
  quantity:number=1;
  removeCart = false;
  cartData:product | undefined;

  	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = true;
	pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor(private product:ProductService) { }

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data)=>{
      this.popularProducts=data;
    });
	this.product.hotProducts().subscribe((data)=>{
		this.hotProducts=data;
	})
  }

  togglePaused() {
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

  onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}

	addToCart() {
		if(this.productData){
		  this.productData.quantity = this.productQuantity;
		  if(!localStorage.getItem('user')){
			this.product.localAddToCart(this.productData);
			this.removeCart=true;
		  }
		  else{
			let user = localStorage.getItem('user');
			let userId = user && JSON.parse(user).id
			let cartData:cart={
			  ...this.productData,
			  userId,
			  productId:this.productData.id,
			}
			delete cartData.id;
	
			this.product.addToCart(cartData).subscribe((result) => {
				if(result){
				  this.product.getCartList(userId);
				  this.removeCart=true;
				}
			})
		  }
		}
	  }

	  removeToCart(productId:string) {
		if(!localStorage.getItem('user')){
		  this.product.removeItemFromCart(productId);
		}
		else{
		  this.cartData && this.product.removeToCart(this.cartData.id)
		  .subscribe((result) =>{
			let user = localStorage.getItem('user');
			let userId = user && JSON.parse(user).id
			this.product.getCartList(userId);
		  })
		}
		this.removeCart = false;
	  }
}