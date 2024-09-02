import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuType: string = 'default';
  sellerName: string = '';
  searchResult: undefined | product[];
  userName: string = '';
  cartItems=0;

  constructor(private route: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = "seller";
          if (localStorage.getItem('seller')) {
            let sellerStore = localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore)[0];
            this.sellerName = sellerData.name;
            this.menuType='seller';
          }
        } else if (localStorage.getItem('user')){
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType='user';
          this.product.getCartList(userData.id);
        } else {
          this.menuType='default';
        }
      }
    });
    let cartData = localStorage.getItem('localCart');
    if(cartData){
      this.cartItems = JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems = items.length
    });
  }

  sellerLogout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }

  searchProducts(query: KeyboardEvent) {
    const element = query.target as HTMLInputElement;
    const searchTerm = element.value.toLowerCase();

    if (searchTerm) {
      this.product.searchProducts(searchTerm).subscribe((result) => {
        const filteredResult = result.filter((product: any) => 
          product.name.toLowerCase().includes(searchTerm)
      );
      this.searchResult = filteredResult;
    });
    } else {
      this.searchResult = [];
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  redirectToDetails(id:string){
    this.route.navigate(['/details/'+id])
  }  

  submitSearch(val:string){
    const searchTerm = val.trim().toLowerCase();

    if (searchTerm) {
      this.product.searchProducts(searchTerm).subscribe((result)=>{
        const exactMatch = result.filter((product: any)=>{
          product.name.toLowerCase() === searchTerm
        });
        this.searchResult = exactMatch;
        this.route.navigate([`search/${searchTerm}`]);
      })
    }
  }

}
