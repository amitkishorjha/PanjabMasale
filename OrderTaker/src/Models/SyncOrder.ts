export interface OrderProducts {
  Id: number,
  Name: string,
  Description: string,
  Price: string,
  Path: string,
  Quantity:number,
  Total:string,
  OrderDetailsId:number
}

 export interface SyncOrder {
  UserId: number,
  ShopId: string,
  OrderId: number,
  OrderStatus: string,
  OrderedDate: Date,
  products: OrderProducts[];
}
