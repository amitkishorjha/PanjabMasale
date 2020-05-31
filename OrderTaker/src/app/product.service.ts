import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Product } from 'src/Models/Product';
import { cartPlusMinuQuantity } from 'src/Models/cartPlusMinuQuantity';
import { DeleteProduct } from 'src/Models/DeleteProduct';
import { Checkout } from 'src/Models/Checkout';
import { CancelOrder } from 'src/Models/CancelOrder';
import { SyncOrder } from 'src/Models/SyncOrder';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  currentShop: any;
  currentproduct:any;
  currentOrder:any;
  
  constructor(private http: HttpClient,public toastController: ToastController) { }

  getProducts()
  {
     return this.http.get<any>(environment.baseUrl+"/api/Product/Get"); 
  }

  SearchShop(name:string)
  {
    return this.http.get<any>(environment.baseUrl+"/api/Shop/Search?name="+name); 
  }

  SearchProduct(name :string )
  {
    return this.http.get<any>(environment.baseUrl+"/api/Product/Search?name="+name); 
  }

  getShop(areaId: string)
  {
    console.log(areaId);
    if(areaId != null && areaId != "")
      return this.http.get<any>(environment.baseUrl+"/api/Shop/GetShopsByAreaId?areaId="+areaId); 
    else
      return this.http.get<any>(environment.baseUrl+"/api/Shop/Get"); 
  }

  AddProduct(formData: Product)
  {
    return this.http.post(environment.baseUrl+"/api/Cart/Add",formData);
  }

  getShopProduct(userId:string,shopId:string)
  {
    return this.http.get(environment.baseUrl+"/api/Cart/Get?userId="+userId+"&shopId="+shopId); 
  }

  productPlusMinusInCart(formData : cartPlusMinuQuantity)
  {
    return this.http.post<any>(environment.baseUrl+"/api/Cart/PlusMinuQuantity",formData);
  }

  productDelete(formData: DeleteProduct)
  {
    return this.http.post<any>(environment.baseUrl+"/api/Cart/Remove",formData);
  }

  Checkout(formData:Checkout)
  {
    return this.http.post<any>(environment.baseUrl+"/api/Order/Checkout",formData);
  }

  GetUserOrders(userId : string)
  {
    return this.http.get<any>(environment.baseUrl+"/api/Order/Get?userId="+userId);
  }

  CancelOrder(formData : CancelOrder)
  {
    return this.http.post<any>(environment.baseUrl+"/api/Order/Cancel",formData);
  }

  SyncOrdersToServer(formData: any)
  {
    console.log('data post'+ formData);
    return this.http.post<any>(environment.baseUrl+"/api/Order/Sync",formData);
  }
}

  