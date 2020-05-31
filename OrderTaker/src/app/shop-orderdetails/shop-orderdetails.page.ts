import { Component, OnInit } from '@angular/core';
import  {ProductService} from '../product.service'
import { Storage } from '@ionic/storage';
import { ToastController ,LoadingController} from '@ionic/angular';
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { CancelOrder } from 'src/Models/CancelOrder';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-shop-orderdetails',
  templateUrl: './shop-orderdetails.page.html',
  styleUrls: ['./shop-orderdetails.page.scss'],
})
export class ShopOrderdetailsPage implements OnInit {
 
  ShopOrderdetail: any;
  cancelorder: CancelOrder;
  customerId:string;
  update:boolean = false;
  OrderId:string = null;
  constructor(private getproductService:ProductService,public toastcontroller: ToastController,
    private storage: Storage,public router: Router,public loadingController:LoadingController,
    private databaseService:DatabaseService,private route: ActivatedRoute) { }

  ngOnInit() {

      this.storage.get('customer').then((val) => {
      if(val)
      {
         this.route.queryParams.subscribe(params => {
          if (params && params.special) {
                this.OrderId = JSON.parse(params.special);
            }
        });

        this.customerId = val.Id;
        this.LoadOrderDetailData(this.OrderId,this.customerId);
      }
      else{
        this.toastcontroller.create({
          message: 'Please login to see your orders',
          duration: 3000,
          position: 'bottom'
        }).then(toast=>toast.present());

        this.router.navigateByUrl('login');
      }
      });
  }

  async Update(Id:number,quantity:string,OrderId:string)
  {
    console.log(Id + quantity + OrderId);
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
        this.OrderId = OrderId;
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

 async LoadOrderDetailData(OrderId:string,customerId:string) {

  const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.databaseService.GetOrderDetailsFromOrder("2",customerId,OrderId).subscribe(detaildata=>{

      if(detaildata.length > 0)
      {
          this.ShopOrderdetail = detaildata;

          console.log('order details : '+ detaildata.length);
          console.log('order details : '+ detaildata[0].ShopName);
      }
       loading.dismiss();
        },
          err => { 
            this.toastcontroller.create({
              message: "Error occured",
              duration: 3000,
              position: 'bottom'
            }).then(toast=>toast.present());
            loading.dismiss();
        });  
  }

  calculateTotalamount(products : any)
  {
    let totalamount: any = 0.0;
    console.log(products);

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

}
