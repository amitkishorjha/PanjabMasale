import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { DatabaseService } from './services/database.service';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import  {ProductService} from './product.service';
import { NetworkserviceService } from './services/networkservice.service';
import { SyncOrder } from 'src/Models/SyncOrder';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Your shops',
      url: '/folder/Inbox',
      icon: 'home'
    },
    {
      title: 'Your orders',
      url: 'orders',
      icon: 'cart'
    }
  ];
  public labels = [];
  public username: string;
  public isValid:boolean = false;
  customer:any;
  ordersforSync:any;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private storage: Storage,
    private router:Router,public toastController: ToastController,
    private getproductService:ProductService,
    private networkservice: NetworkserviceService,
    public loadingController:LoadingController,private databaseService: DatabaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.storage.get('customer').then((val) => {
      if(val)
      {
        this.username = val.CustomerEmail;
        this.isValid = true;
      }else
      {
        this.username = null;
        this.isValid = false;
      }
    });

    this.router.navigateByUrl('login');
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  async SyncOrders()
  {
    const loading = await this.loadingController.create({
      message: 'Please wait sync in progress...'
    });

    let constatus = this.networkservice.getCurrentNetworkStatus();

    if(constatus == 0)
    {
      await loading.present();
      this.storage.get('customer').then((val) => {

      if(val)
      {
          this.databaseService.SyncOrders(val.Id).then(data =>{
            this.ordersforSync = data;
            if(this.ordersforSync.length > 0)
            {
                this.databaseService.getProductsforSyncOrder(this.ordersforSync).then(fulldata =>{

                    this.getproductService.SyncOrdersToServer(fulldata).subscribe(syncdata=>{

                        this.databaseService.UpdatSynceOrders(this.ordersforSync).then(updatedata =>{
                              console.log('data' + updatedata);

                          this.toastController.create({
                              message: "Orders sync has done",
                              duration: 3000,
                              position: 'bottom',
                              }).then(toast=>toast.present());

                        });
                              loading.dismiss();
                  },
                  err => { 
                          this.toastController.create({
                            message: err.message,
                            duration: 3000,
                            position: 'bottom',
                          }).then(toast=>toast.present());
                          loading.dismiss();
                  });
                });
            }else
            {
                        this.toastController.create({
                            message: "no new orders found for sync",
                            duration: 3000,
                            position: 'bottom',
                          }).then(toast=>toast.present());
                          
                          loading.dismiss();
            }
        });
      }
    });
  }else
    {
      this.toastController.create({
        message: "You are offline",
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
    }
}
  
  LogOut()
  {
    this.isValid = false;
    this.username = "Not loggedIn";
    this.storage.remove("customer");
    this.router.navigateByUrl('login');
  }

  Login()
  {
    this.router.navigateByUrl('login');
  }

  LoginApp(loginForm: NgForm )
  {
    this.Loadlogin(loginForm);
  }

  async Loadlogin(loginForm: NgForm) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.userService.Login(loginForm.value).subscribe(
      data => {
        this.customer = data;
        this.storage.set('customer', data);
        if(data)
        {
          this.username = this.customer.CustomerEmail;
          this.isValid = true;

          this.toastController.create({
            message: 'User loggedin successfully',
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());
        this.router.navigateByUrl('folder/Index');

        }else
        {
          this.username = null;
          this.isValid = false;
        }

        loading.dismiss();
      },
        err => { 
          this.username = null;
          this.isValid = false;

          this.toastController.create({
            message: err.error.message,
            duration: 3000,
            position: 'bottom'
          }).then(toast=>toast.present());

          loading.dismiss();
      }
    );
  }
}
