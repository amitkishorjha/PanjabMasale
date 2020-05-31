import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopOrderdetailsPageRoutingModule } from './shop-orderdetails-routing.module';

import { ShopOrderdetailsPage } from './shop-orderdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopOrderdetailsPageRoutingModule
  ],
  declarations: [ShopOrderdetailsPage]
})
export class ShopOrderdetailsPageModule {}
