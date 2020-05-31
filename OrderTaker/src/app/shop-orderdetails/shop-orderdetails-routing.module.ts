import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopOrderdetailsPage } from './shop-orderdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ShopOrderdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopOrderdetailsPageRoutingModule {}
