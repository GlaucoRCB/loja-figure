import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { cart, login, product, SingUp } from '../data-type';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  showLogin:boolean=true;
  authError:string ="";
  product: any;

  constructor(private user:UserService) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  singup(data:SingUp): void {
    this.user.userSingup(data)
  }

  login(data:login): void {
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result)=>{
      if(result){
        this.authError="Usuário não encontrado!";
      }
      else{
        this.localCartToRemoveCart()
      }
    })
  }

  openLogin() {
    this.showLogin=true;
  }

  openSingup() {
    this.showLogin=false;
  }

  localCartToRemoveCart() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    let data = localStorage.getItem('localCart');
    if(data){
      let cartDataList:product[] = JSON.parse(data);
      cartDataList.forEach((product:product,index)=>{
        let cartData: cart = {
          ...product,
          productId:product.id,
          userId,
        };

        delete cartData.id;

        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result:any)=>{
            if(result){
              console.warn("Dados Salvos no Banco de Dados")
            }
          })
        }, 500);
        if(cartDataList.length===index+1) {
          localStorage.removeItem('localCart')
        }
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000)
  }

}
