import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { login, SingUp } from '../data-type';


@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {

  showLogin:boolean=true;
  authError:string='';

  constructor(private seller:SellerService) { }

  ngOnInit():void{
    this.seller.sellerAuthReload();
  }

  singUp(data: SingUp): void {
    this.seller.sellerSignUp(data);
  }

  login(data: login): void {
    this.seller.sellerLogin(data)
    this.seller.invalidSellerAuth.subscribe((result)=>{
      if(result){
        this.authError="Email ou Senha não corresponde.";
      }
    })
  }

  openLogin(){
    this.showLogin=true;
  }

  openSingUp(){
    this.showLogin=false;
  }
}
