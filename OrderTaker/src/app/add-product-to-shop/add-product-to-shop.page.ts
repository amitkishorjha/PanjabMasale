import { Component, OnInit } from '@angular/core';
import  {ProductService} from '../product.service'
import {ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';
import { Product } from 'src/Models/Product';
import { DatabaseService } from '../services/database.service';
declare var window;

@Component({
  selector: 'app-add-product-to-shop',
  templateUrl: './add-product-to-shop.page.html',
  styleUrls: ['./add-product-to-shop.page.scss'],
})
export class AddProductToShopPage implements OnInit {
  
  customerId: string;
  currentproduct: any;
  selectedQuantity: string = null;
  product: Product;
  shopId:string;
  constructor(private getproductService:ProductService,private storage:Storage,private router:Router,
    private toastcontroller:ToastController,public loadingController:LoadingController
    ,private route: ActivatedRoute,private databaseService:DatabaseService) { }

  ngOnInit() {
    this.currentproduct = this.getproductService.currentproduct;

    this.storage.get('customer').then((val) => {
      if(val)
      {
        this.customerId = val.Id;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.shopId = JSON.parse(params.special);
      }
    });
  }

  // plus()
  // {
  //   this.selectedQuantity++;
  // }

  // minus()
  // {
  //   this.selectedQuantity--;
  // }

 async onSubmit(orderForm : NgForm)
  {
    console.log(this.selectedQuantity);
    if(this.selectedQuantity == "0" || this.selectedQuantity == null)
    {
      this.toastcontroller.create({
        message: "Please enter quantity",
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
  
    }else
    {
    const loading = await this.loadingController.create({
      message: 'Adding product for you...'
    });
    await loading.present();

      this.product = {UserId: this.customerId , Price : orderForm.value.Price ,ProductBrandId : orderForm.value.Id,
      Quantity: parseInt(this.selectedQuantity),ShopId :this.shopId};

      console.log("added product"+ this.product);
          
      this.databaseService.InsertOrderData(this.product).then(
        data => {
          this.toastcontroller.create({
            message: "product added successfully",
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());
          
        loading.dismiss();
        window.addproduct.ngOnInit();
        this.router.navigateByUrl('/add-product');
        },
          err => { 
            this.toastcontroller.create({
              message: err.error.Message,
              duration: 3000,
              position: 'bottom'
            }).then(toast=>toast.present());

            loading.dismiss();
        });
    }
  }
}
