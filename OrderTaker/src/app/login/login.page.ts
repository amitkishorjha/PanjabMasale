import { Component, OnInit } from '@angular/core';
import { User } from 'src/Models/User';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkserviceService } from '../services/networkservice.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login: User = { UserName: '', Password: '' };
  constructor(public router: Router,
    private storage: Storage,private appcomponent:AppComponent,public toastController: ToastController,
    private networkservice: NetworkserviceService) { }

  ngOnInit() {

    this.storage.get('customer').then((val) => {
      if(val != null)
      {
        this.router.navigateByUrl('folder/Index');
      }
    });

  }

  onSubmit(loginForm: NgForm){

    let constatus = this.networkservice.getCurrentNetworkStatus();
    
    if(constatus == 0)
    {
      this.appcomponent.LoginApp(loginForm);
    }else
    {
      this.toastController.create({
        message: "You are offline",
        duration: 3000,
        position: 'bottom'
      }).then(toast=>toast.present());
    }
}

Skip()
{
  this.router.navigateByUrl('home');
}

}
