import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductToShopPageRoutingModule } from './add-product-to-shop-routing.module';

import { AddProductToShopPage } from './add-product-to-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProductToShopPageRoutingModule
  ],
  declarations: [AddProductToShopPage]
})
export class AddProductToShopPageModule {}
