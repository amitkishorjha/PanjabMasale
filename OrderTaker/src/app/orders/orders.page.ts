import { Component, OnInit } from '@angular/core';
import {ProductService} from '../product.service';
import { Storage } from '@ionic/storage';
import { ToastController ,LoadingController} from '@ionic/angular';
import { CancelOrder } from 'src/Models/CancelOrder';
import { DatabaseService } from '../services/database.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  hasOrders:boolean = false;
  customerId:string;
  OrderId:string;
  TotalAmount:string;
  OrderStatus:string;
  CartDetails:any;
  Orders:any;
   cancelorder: CancelOrder;

  constructor(private getproductService:ProductService,public toastcontroller: ToastController,
    private storage: Storage,public router: Router,public loadingController:LoadingController,
    private databaseService:DatabaseService) { }

  ngOnInit() {

    this.storage.get('customer').then((val) => {
      if(val)
      {
        this.customerId = val.Id;
         
        this.LoadData(this.customerId);
     
      }else
      {
        this.toastcontroller.create({
          message: 'Please login to see your orders',
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        this.router.navigateByUrl('login');
      }
    });

  }

  ionViewWillEnter() {
         this.storage.get('customer').then((val) => {
      if(val)
      {
        this.customerId = val.Id;
         
        this.LoadData(this.customerId);
     
      }else
      {
        this.toastcontroller.create({
          message: 'Please login to see your orders',
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        this.router.navigateByUrl('login');
      }
    });

  }

  async LoadData(customerId:string) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.databaseService.getOrders("2",customerId,null).subscribe(data=>{
      if(data.length > 0)
      {
        this.hasOrders = true;
        this.Orders = data;
      }
      else
      {
        this.hasOrders = false;
      }
      loading.dismiss();
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

  calculateTotalamount(products : any)
  {
    let totalamount: any = 0.0;
      if (products.length > 0) {
              for (var i = 0; i < products.length; i++) {
                  totalamount = parseFloat(totalamount) + parseFloat(products[i].Total);
              }
      }

      return totalamount;
  }


   GetOrderStatus(statsvalue: number)
  {
      if(statsvalue == 0)
        return 'Draft';
        else if(statsvalue == 1)
        return 'Removed';
        else if(statsvalue == 2)
        return 'Ordered';
        else if(statsvalue == 3)
        return 'Approved';
        else if(statsvalue == 4)
        return 'Shipped';
        else
        return 'Cancelled';
  }

  onCardClick(orderId)
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(orderId)
        }
      };
        console.log('orderid'+ orderId);
        this.router.navigate(['shop-orderdetails'], navigationExtras);
  }

  async CancelOrder(order)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.cancelorder = {UserId : order.UserId,OrderId:order.OrderId};

    this.databaseService.UpdateOrder(5,order.UserId,order.OrderId,2).then(
      data => { 
        this.toastcontroller.create({
          message: "order cancelled",
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());
        
        loading.dismiss();
        this.ngOnInit();
      },
          err => { 
            this.toastcontroller.create({
              message: "Error occered",
              duration: 3000,
              position: 'bottom'
            }).then(toast=>toast.present());

            loading.dismiss();
        }
      );
  }

}
