import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  updateProductMessage: string | undefined;
  productData:undefined | product;

  constructor(private route: ActivatedRoute , private product:ProductService) { }

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    productId && this.product.getProduct(productId).subscribe((data)=>{
      this.productData = data;
    })
  }

  update(data:product){
    if(this.productData){
      data.id=this.productData.id
    }
    this.product.updateProduct(data).subscribe((result)=>{
      if(result){
        this.updateProductMessage="Produto Atualizado Com Sucesso!";
      }
      setTimeout(()=>(this.updateProductMessage=undefined),3000);
    })
  }

}
