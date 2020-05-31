import { Component, OnInit } from '@angular/core';
import  {ProductService} from '../product.service'
import { Router, NavigationExtras } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { cartPlusMinuQuantity } from 'src/Models/cartPlusMinuQuantity';
import { DeleteProduct } from 'src/Models/DeleteProduct';
import { Checkout } from 'src/Models/Checkout';
import { DatabaseService } from '../services/database.service';
declare var window;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  customerId: string;
  currentshop: any;
  products :any;
  deleteproduct: DeleteProduct;
  cartPlusMinuQuantity: cartPlusMinuQuantity;
  checkout: Checkout;
  disable:boolean = true;

  constructor(private getproductService:ProductService,private storage:Storage,private router:Router,
    private toastcontroller:ToastController,public loadingController:LoadingController,
    private databaseService:DatabaseService) { 

      window.addproduct = this;
    }

  ngOnInit() {

    this.currentshop = this.getproductService.currentShop;
    
    this.storage.get('customer').then((val) => {
      if(val)
      {
        this.customerId = val.Id;
      }
    });
    this.LoadProducts();
  }

  async LoadProducts() {
    const loading = await this.loadingController.create({
      message: 'Loading products for you...'
    });
    await loading.present();

    this.databaseService.getOrders("0",this.customerId,this.currentshop.Id).subscribe(data=>{
        this.products = data;
        console.log(data);
        loading.dismiss();
    },
    err => { 
      this.toastcontroller.create({
        message: err.error.message,
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      console.log(err);
      loading.dismiss();
      this.products = null;
  });
  }

    GetProducts()
    {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.currentshop.Id)
        }
      };
  
        this.router.navigate(['products'], navigationExtras);
    }

   async Update(Id:number,quantity:string)
    {
        console.log(Id + quantity);
  if(quantity == "0" || quantity == null)
  {
      this.toastcontroller.create({
          message: "Please enter quantity",
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

  }else
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.databaseService.UpdateOrderDetail(Id,quantity).then(
      data => {
        this.toastcontroller.create({
          message: "updated successfully",
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        loading.dismiss();
        this.ngOnInit();
      },
        err => { 
          this.toastcontroller.create({
            message: err.error.message,
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());

          loading.dismiss();
      }
    );
  }
  }

 async minus(item: any,OrderId)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.cartPlusMinuQuantity = {OrderDetailId:item.Id,IsplusQuantity:false,
      ProductId:item.ProuctId,Quantity : 1};
    
      this.getproductService.productPlusMinusInCart(this.cartPlusMinuQuantity).subscribe(
        data => {
          this.toastcontroller.create({
            message: data.message,
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());
          
          this.ngOnInit();

          loading.dismiss();
        },
          err => { 
            this.toastcontroller.create({
              message: err.error.message,
              duration: 3000,
              position: 'bottom'
            }).then(toast=>toast.present());

            loading.dismiss();

            console.log(err);
        }
      );
  }

  async plus(item: any,OrderId)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.cartPlusMinuQuantity = {OrderDetailId:item.Id,IsplusQuantity:true,
      ProductId:item.ProuctId,Quantity : 1};

      console.log(this.cartPlusMinuQuantity);

      this.getproductService.productPlusMinusInCart(this.cartPlusMinuQuantity).subscribe(
        data => {

          this.toastcontroller.create({
            message: data.message,
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());

          this.ngOnInit();
          loading.dismiss();
        },
          err => { 
            this.toastcontroller.create({
              message: err.error.message,
              duration: 3000,
              position: 'bottom'
            }).then(toast=>toast.present());

            loading.dismiss();

            console.log(err);
        }
      );
  }

  async delete(OrderDetailId: string)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.databaseService.DeleteOrderDetail(OrderDetailId).then(
      data => {
        this.toastcontroller.create({
          message: "deleted successfully",
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        loading.dismiss();
        this.ngOnInit();
      },
        err => { 
          this.toastcontroller.create({
            message: err.error.message,
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());

          loading.dismiss();
      }
    );
  }

  async Order(OrderId, userId)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.checkout = {OrderId:OrderId , UserId : userId};
    console.log(this.checkout);

    this.databaseService.UpdateOrder(2,userId,OrderId,0).then(
      data => {
        this.toastcontroller.create({
          message: "order created successfully",
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        loading.dismiss();
        this.ngOnInit();
      },
        err => { 
          this.toastcontroller.create({
            message: "Error occured",
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());

          loading.dismiss();
      }
    );

  }
}
