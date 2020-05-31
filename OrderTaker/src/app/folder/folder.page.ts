import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController,AlertController } from '@ionic/angular';
import  {ProductService} from '../product.service'
import { Storage } from '@ionic/storage';
import { DatabaseService } from '../services/database.service';
import { NetworkserviceService } from '../services/networkservice.service'

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  
  shops_data:any;
  IssearchBarOpened:boolean = false;
  filterBy: string = null;
  areaId: string = null;
  datafetch:number = 0;

  constructor(private activatedRoute: ActivatedRoute,private getproductService:ProductService,public toastController: ToastController,
    private storage: Storage,public router: Router,public loadingCtrl: LoadingController,
    private databaseService: DatabaseService,private networkservice: NetworkserviceService,
    public alertController: AlertController) { }

  ngOnInit() {

    this.storage.get('customer').then((val) => {
      if(val)
      {
        this.areaId = val.AreaId;
      }
    });

    this.LoadData(null);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'No data found for Shops. Do you want to fetch data from server ?',
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
    const loading = await this.loadingCtrl.create({
      message: 'Loading data ...'
    });
    await loading.present();

    let constatus = this.networkservice.getCurrentNetworkStatus();

    if(constatus == 0)
    {
        this.getproductService.getShop(this.areaId).subscribe(data=>{    
          for(let item of data)
          {
              console.log('before '+ item)
              this.databaseService.InsertData(item);
          }  
          this.LoadData(null);
      });
    }else
    {
      this.toastController.create({
        message: "You are offline",
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      this.LoadData(null);
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
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();

    console.log(event.target.value);
    this.databaseService.getShops(this.areaId,event.target.value).subscribe(data=>{
        this.shops_data = data;
        loading.dismiss();
    },
    err => { 
      this.toastController.create({
        message: err.error.message,
        duration: 3000,
        position: 'bottom',
      }).then(toast=>toast.present());

      loading.dismiss();

  });
}

  async LoadData(filterBy:string) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    await loading.present();

    if(filterBy != null && filterBy != "")
    {
      this.databaseService.getShops(this.areaId,null).subscribe(data=>{
        console.log('shop data'+ data);

        if(data.length == 0)
        {
          loading.dismiss();
          this.presentAlertConfirm();

        }else
        {
          this.shops_data = data;
          loading.dismiss();      
        }
    },
    err => { 
      this.toastController.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      console.log(err);
      loading.dismiss();

  });
    }else
    {
      this.databaseService.getDatabaseState().subscribe(rdy => {
      
      if (rdy) {
          this.databaseService.getShops(this.areaId,null).subscribe(data=>{

          this.datafetch++;
          console.log('datafetch'+ this.datafetch);
      
          if(data.length == 0 && this.datafetch == 2)
          {
            loading.dismiss();
            this.presentAlertConfirm();
          }else
          {
            this.shops_data = data;
            loading.dismiss(); 
          }
    },
    err => { 
      this.toastController.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
      console.log(err);
      loading.dismiss();
        
        });
      }
    });
   }
  }

  onCardClick(shop)
  {
    this.getproductService.currentShop = shop;
    this.router.navigateByUrl('add-product');
  }

}
