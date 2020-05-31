import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopOrdersPage } from './shop-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ShopOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopOrdersPageRoutingModule {}
