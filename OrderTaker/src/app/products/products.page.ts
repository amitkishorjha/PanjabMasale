import { Component, OnInit } from '@angular/core';
import  {ProductService} from '../product.service'
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController ,AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatabaseService } from '../services/database.service';
import { NetworkserviceService } from '../services/networkservice.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  customerId: string;
  IssearchBarOpened:boolean = false;
  products :any;
  shopId:string;
  datafetch:number = 0;

  constructor(private getproductService:ProductService,private storage:Storage,private router:Router,
    private toastcontroller:ToastController,public loadingController:LoadingController,private route: ActivatedRoute,
    private databaseService: DatabaseService,private networkservice: NetworkserviceService,
     public alertController: AlertController) { }

  ngOnInit() {
    this.LoadProducts();

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.shopId = JSON.parse(params.special);
      }
    });
  }

  async LoadProducts() {
    const loading = await this.loadingController.create({
      message: 'Loading products for you...'
    });
    await loading.present();

     this.databaseService.getProducts(null).subscribe(data=>{
          this.datafetch++;
          console.log('datafetch'+ this.datafetch);
      
          if(data.length == 0 && this.datafetch == 2)
          {
              loading.dismiss();
              this.presentAlertConfirm();
          }else
          {
              loading.dismiss();
              this.products = data;
          }
    },
    err => { 
      this.toastcontroller.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      console.log(err);
      loading.dismiss();

  });
  }

  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'No data found for Products. Do you want to fetch data from server ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           alert.dismiss();
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.refreshList(null);
          }
        }
      ]
    });

    await alert.present();
  }

  async refreshList(event)
  {
    const loading = await this.loadingController.create({
      message: 'Loading data please wait...'
    });
    await loading.present();

    let constatus = this.networkservice.getCurrentNetworkStatus();

  if(constatus == 0)
  {
    this.getproductService.getProducts().subscribe(data=>{    
    console.log('get product from api and insert in db');

      for(let item of data)
      {
          console.log('before '+ item)
          this.databaseService.InsertProductData(item);
      }  
      this.LoadProducts();
  });
  }else
  {
      this.toastcontroller.create({
        message: "You are offline",
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      this.LoadProducts();
  }
      loading.dismiss();

  if(event != null)
  {
      setTimeout(() => {
        event.target.complete();
      },500);
  }
}


  async onSearch(event)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    console.log(event.target.value);
    this.databaseService.getProducts(event.target.value).subscribe(data=>{
        this.products = data;
        loading.dismiss();
    },
    err => { 
      this.toastcontroller.create({
        message: err.error.message,
        duration: 3000,
        position: 'bottom',
      }).then(toast=>toast.present());
      loading.dismiss();

  });
  }


    onCardClick(product)
    {
      this.getproductService.currentproduct = product;

      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.shopId)
        }
      };
  
        this.router.navigate(['add-product-to-shop'], navigationExtras);
    }

}
