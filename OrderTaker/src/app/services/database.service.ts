import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { ProductService } from '../product.service'
import { DatePipe } from '@angular/common';

export interface Shop {
  Id: number,
  Name: string,
  AreaId: number,
  AreaName: string,
  Status: string
}

export interface GetProduct {
  Id: number,
  Name: string,
  Description: string,
  Price: string,
  Path: string
}

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

 export interface GetOrder {
  UserId: number,
  ShopId: string,
  OrderId: number,
  OrderStatus: string,
  OrderedDate: Date,
  ShopName:Promise<string>,
  TotalAmount:any,
  products: OrderProducts[];
}

export interface GetOrderDetails {
  OrderId: number,
  ProductId: string,
}

export interface SyncOrder {
  UserId: number,
  ShopId: string,
  OrderId: number,
  OrderStatus: string,
  OrderedDate: string,
  products: OrderProducts[]
}


@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  Shopname: string = "Shop Name";
  ordersforSync :SyncOrder[];
  Shop = new BehaviorSubject([]);
  products = new BehaviorSubject([]);
  orders = new BehaviorSubject([]);
  orderdetails = new BehaviorSubject([]);
  syncOrders : OrderProducts[];

  constructor(private plt: Platform, private sqlite: SQLite, private http: HttpClient,private sqlitePorter: SQLitePorter,private getproductService:ProductService
  ,private datePipe: DatePipe) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'OrderTaker.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

 seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  InsertData(shop: any)
  {
    this.database.executeSql('SELECT * FROM Shop WHERE Id= ?', [shop.Id]).then(data => {
          console.log(data.rows.length);
            if(data.rows.length == 0)
            {
                  let item = [shop.Id, shop.Name, shop.AreaId, shop.AreaName,shop.Status];
                  console.log(item);
                  return this.database.executeSql('INSERT INTO Shop (Id,Name, AreaId, AreaName , Status) VALUES (?, ?, ?,?,?)', item).then(()=>{
                  console.log("inserted");
          
              },    function(error) {
                    console.log('SELECT error: ' + error.message);
              });
            }
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getShops(areaId,name:string): Observable<Shop[]> {
    this.loadShops(areaId,name);
    return this.Shop.asObservable();
  }

  loadShops(areaId,name:string) {
    
    this.Shop = new BehaviorSubject([]);

    if(name == null || name == "")
    {
    return this.database.executeSql('SELECT * FROM Shop WHERE AreaId=?', [areaId]).then(data => {
      let shops: Shop[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
          shops.push({ 
            Id: data.rows.item(i).Id,
            Name: data.rows.item(i).Name, 
            AreaId: data.rows.item(i).AreaId, 
            AreaName: data.rows.item(i).AreaName,
            Status:data.rows.item(i).Status,
           });
        }
      }
      this.Shop.next(shops);
     });
    }else
    {
    return this.database.executeSql('SELECT * FROM Shop WHERE AreaId=? AND (Name LIKE ?)',  [areaId,'%'+name+'%']).then(data => {
      let shops: Shop[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
          shops.push({ 
            Id: data.rows.item(i).Id,
            Name: data.rows.item(i).Name, 
            AreaId: data.rows.item(i).AreaId, 
            AreaName: data.rows.item(i).AreaName,
            Status:data.rows.item(i).Status,
           });
        }
      }
      this.Shop.next(shops);
     });

    }
  }

  InsertProductData(product: any)
  {
    this.database.executeSql('SELECT * FROM Product WHERE Id= ?', [product.Id]).then(data => {
            if(data.rows.length == 0)
            {
                  let item = [product.Id, product.Name, product.Description, product.Price,product.Path];
                  console.log(item);
                  return this.database.executeSql('INSERT INTO Product (Id,Name, Description, Price , Path) VALUES (?, ?, ?,?,?)', item).then(()=>{
                  console.log("inserted");
          
              },    function(error) {
                    console.log('SELECT error: ' + error.message);
              });
            }
    });
  }

  loadProducts(name:string) {
    console.log('load products')
    if(name == null || name == "")
    {
    return this.database.executeSql('SELECT * FROM Product', []).then(data => {
      let products: GetProduct[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
          products.push({ 
            Id: data.rows.item(i).Id,
            Name: data.rows.item(i).Name, 
            Description: data.rows.item(i).Description, 
            Price: data.rows.item(i).Price,
            Path:data.rows.item(i).Path,
           });
        }
      }
      this.products.next(products);
     });
   }
   else
   {
     return this.database.executeSql('SELECT * FROM Product WHERE (Name LIKE ?)', ['%'+name+'%']).then(data => {
      let products: GetProduct[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
          products.push({ 
            Id: data.rows.item(i).Id,
            Name: data.rows.item(i).Name, 
            Description: data.rows.item(i).Description, 
            Price: data.rows.item(i).Price,
            Path:data.rows.item(i).Path,
           });
        }
      }
      this.products.next(products);
     });
   }

  }

   getProducts(name :string): Observable<GetProduct[]> {
    this.loadProducts(name);
    return this.products.asObservable();
  }

  InsertOrderData(product: any)
  {
    console.log('fetch order data' + product.UserId + product.ShopId);
     return this.database.executeSql('SELECT * FROM Orders WHERE UserId=? AND ShopId=? AND OrderStatus=?',
          [product.UserId,product.ShopId,0]).then(data1 => {

            console.log('get order data length '+ data1.rows.length);
              if (data1.rows.length == 0) {
                let orderdata = [product.ShopId,product.UserId,"0",0,new Date().toString(),0];

                console.log('get order data '+ orderdata);
                  this.database.executeSql('INSERT INTO Orders (ShopId,UserId,Total,OrderStatus,OrderedDate,IsSync) Values (?,?,?,?,?,?)',orderdata).then(()=>{

                     this.database.executeSql('select Max(Id) AS Id from Orders',[]).then(data =>{
                           console.log('inserted id= '+ data.rows.item(0).Id);
                           this.InsertOrderDetailData(product,data.rows.item(0).Id);

                     });
          
              },    function(error) {
                    console.log('insert error: ' + error.message);
              });
          }else
          {
            this.InsertOrderDetailData(product,data1.rows.item(0).Id);
          }
    });
  }

  
  InsertOrderDetailData(product: any,orderid:string)
  {
      let orderdetaildata = [orderid,product.ProductBrandId,product.Price,product.Quantity,0];
      console.log('get orderdetail data '+ orderdetaildata);
        this.database.executeSql('INSERT INTO OrderDetails (OrderId,ProductBrandId,Price,Quantity,IsSync) Values (?,?,?,?,?)',orderdetaildata).then(()=>{
                  console.log("inserted");
          
                  },    function(error) {
                        console.log('insert error: ' + error.message);
                });
  }

  LoadOrderData(status:string,UserId:string,ShopId:string){

       this.orders = new BehaviorSubject([]);

       this.database.executeSql('SELECT Orders.UserId AS UserId,Orders.ShopId AS ShopId,Orders.Id AS Id,Orders.OrderStatus AS OrderStatus, '+
       'Orders.OrderedDate AS OrderedDate,shop.Name AS ShopName FROM Orders inner join shop on orders.ShopId = shop.Id WHERE UserId=? AND OrderStatus=? AND ShopId=? ORDER BY Orders.OrderedDate DESC',
          [UserId,status,ShopId]).then(data => {
            let orders: GetOrder[] = [];
  
            console.log('orders: '+data.rows);

            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                
                orders.push({ 
                  UserId: data.rows.item(i).UserId,
                  ShopId: data.rows.item(i).ShopId, 
                  OrderId: data.rows.item(i).Id,
                  OrderStatus:data.rows.item(i).OrderStatus,
                  OrderedDate:data.rows.item(i).OrderedDate,
                  ShopName:data.rows.item(i).ShopName,
                  products:this.getProductsforOrder(data.rows.item(i).Id),
                  TotalAmount: 0
                });
              }
            }
      this.orders.next(orders);
    });
  }


  getOrders(status:string,UserId:string,ShopId:string): Observable<GetOrder[]> {
    console.log(status+UserId+ShopId);
    if(ShopId == null)
    {
        this.getOrderedOrders(UserId,status);
    }else
    {
      this.LoadOrderData(status,UserId,ShopId);
    }
    return this.orders.asObservable();
  }

  GetOrderDetailsFromOrder(status:string,UserId:string,OrderId:string) : Observable<GetOrder[]>
  {
      this.getOrdersFromOrder(status,UserId,OrderId);
      console.log('data'+ this.orders);
      return this.orders.asObservable();

  }

  getOrdersFromOrder(status:string,UserId:string,OrderId:string)
  {
      this.orders = new BehaviorSubject([]);

       this.database.executeSql('SELECT Orders.UserId AS UserId,Orders.ShopId AS ShopId,Orders.Id AS Id,Orders.OrderStatus AS OrderStatus, '+
       'Orders.OrderedDate AS OrderedDate,shop.Name AS ShopName FROM Orders inner join shop on orders.ShopId = shop.Id WHERE UserId=? AND Orders.Id=? ORDER BY Orders.OrderedDate DESC',
          [UserId,OrderId]).then(data => {
            let orders: GetOrder[] = [];
 
            if (data.rows.length > 0) {

              console.log('orders'+ data.rows);
              for (var i = 0; i < data.rows.length; i++) {
                
                orders.push({ 
                  UserId: data.rows.item(i).UserId,
                  ShopId: data.rows.item(i).ShopId, 
                  OrderId: data.rows.item(i).Id,
                  OrderStatus:data.rows.item(i).OrderStatus,
                  OrderedDate:data.rows.item(i).OrderedDate,
                  ShopName:data.rows.item(i).ShopName,
                  products:this.getProductsforOrder(data.rows.item(i).Id),
                  TotalAmount: 0
                });
              }
            }
      this.orders.next(orders);
    });
  }

  getOrderedOrders(UserId:string,status:string)
  {
      this.orders = new BehaviorSubject([]);

      this.database.executeSql('SELECT Orders.UserId AS UserId,Orders.ShopId AS ShopId,Orders.Id AS Id,Orders.OrderStatus AS OrderStatus, '+
       'Orders.OrderedDate AS OrderedDate,shop.Name AS ShopName FROM Orders inner join shop on orders.ShopId = shop.Id WHERE UserId=? AND OrderStatus=? ORDER BY Orders.OrderedDate DESC',
          [UserId,status]).then(data => {
            let orders: GetOrder[] = [];
 
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                
                orders.push({ 
                  UserId: data.rows.item(i).UserId,
                  ShopId: data.rows.item(i).ShopId, 
                  OrderId: data.rows.item(i).Id,
                  OrderStatus:data.rows.item(i).OrderStatus,
                  OrderedDate:data.rows.item(i).OrderedDate,
                  ShopName:data.rows.item(i).ShopName,
                  products:this.getProductsforOrder(data.rows.item(i).Id),
                  TotalAmount: 0
                });
              }
            }
      this.orders.next(orders);
    });
  }
  
  getOrdersDetails() {
    this.database.executeSql('SELECT * FROM OrderDetails',[]).then(data => {
             console.log(data);
            let orderdetails: GetOrderDetails[] = [];
 
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                
                orderdetails.push({ 
                  OrderId: data.rows.item(i).Id,
                  ProductId: data.rows.item(i).ProductBrandId
                });
              }
            }
      this.orderdetails.next(orderdetails);
    });
  }

 getProductsforOrder(orderId: string) : OrderProducts[]
 {
    let orderproducts: OrderProducts[] = [];

    this.database.executeSql('SELECT Product.Id AS Id,Product.Name AS Name,Product.Description AS Description,'+
    'Product.Price AS Price,Product.Path AS Path,OrderDetails.Id AS OrderDetailsId,OrderDetails.Quantity AS Quantity,OrderDetails.Price AS Total FROM Product inner join OrderDetails on Product.Id = OrderDetails.ProductBrandId'+
      ' WHERE OrderDetails.OrderId=?',[orderId]).then(data => {

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
          orderproducts.push({ 
            Id: data.rows.item(i).Id,
            Name: data.rows.item(i).Name, 
            Description: data.rows.item(i).Description, 
            Price: data.rows.item(i).Price,
            Path:data.rows.item(i).Path,
            Quantity: data.rows.item(i).Quantity,
            Total: (parseFloat(data.rows.item(i).Price) * parseInt(data.rows.item(i).Quantity)).toString(),
            OrderDetailsId:data.rows.item(i).OrderDetailsId
           });
        }
      }
    });
    return orderproducts;
 } 

 UpdateOrder(status: number,UserId :number,orderId: number,updatestatus:number)
 {
       return this.database.executeSql('UPDATE Orders set OrderStatus = ? WHERE UserId = ? AND Id = ? AND OrderStatus = ? ',
       [status,UserId,orderId,updatestatus]).then(()=>{
                  console.log("updated");
          
                  },    function(error) {
                        console.log('updated error: ' + error.message);
        });
 }

 DeleteOrderDetail(orderdetailId)
 {
     return this.database.executeSql('DELETE FROM OrderDetails WHERE Id = ?',[orderdetailId]).then(()=>{
                  console.log("deleted");
          
                  },    
                  function(error) {

                        console.log('updated error: ' + error.message);
        });
 }

 UpdateOrderDetail(orderdetailId,Quantity)
 {
     return this.database.executeSql('UPDATE OrderDetails set Quantity = ? WHERE Id = ?',[Quantity,orderdetailId]).then(()=>{
                  console.log("order detail updated");
          
                  },    
                  function(error) {

                        console.log('updated error: ' + error.message);
        });
 }

 async SyncOrders(UserId:string) : Promise<SyncOrder[]>
 {
    this.ordersforSync = [];
    await this.database.executeSql('SELECT * FROM Orders WHERE UserId=? AND OrderStatus !=? AND IsSync=?',[UserId,0,0]).then(data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                
                this.ordersforSync.push({ 
                  UserId: data.rows.item(i).UserId,
                  ShopId: data.rows.item(i).ShopId, 
                  OrderId: data.rows.item(i).Id,
                  OrderStatus:data.rows.item(i).OrderStatus,
                  OrderedDate:this.datePipe.transform(data.rows.item(i).OrderedDate,"yyyy-MM-dd"),
                  products:[]
                });
              }
            }
    });
    console.log('data' + this.ordersforSync);
    return this.ordersforSync;
 } 

 async getProductsforSyncOrder(ordersdata:any) : Promise<SyncOrder[]>
 {
   for (var j = 0; j < ordersdata.length; j++) {

        this.syncOrders = [];

       await this.database.executeSql('SELECT Product.Id AS Id,Product.Name AS Name,Product.Description AS Description,'+
        'Product.Price AS Price,Product.Path AS Path,OrderDetails.Id AS OrderDetailsId,OrderDetails.Quantity AS Quantity,OrderDetails.Price AS Total FROM Product inner join OrderDetails on Product.Id = OrderDetails.ProductBrandId'+
          ' WHERE OrderDetails.OrderId=?',[ordersdata[j].OrderId]).then(data => {

          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              
              this.syncOrders.push({ 
                Id: data.rows.item(i).Id,
                Name: data.rows.item(i).Name, 
                Description: data.rows.item(i).Description, 
                Price: data.rows.item(i).Price,
                Path:data.rows.item(i).Path,
                Quantity: data.rows.item(i).Quantity,
                Total: (parseFloat(data.rows.item(i).Price) * parseInt(data.rows.item(i).Quantity)).toString(),
                OrderDetailsId:data.rows.item(i).OrderDetailsId
              });
            }
          }
        });

        ordersdata[j].products = this.syncOrders;
   }

    console.log('products' + ordersdata);
    return ordersdata;
 }

 async UpdatSynceOrders(ordersdata:any) : Promise<string>
 {
   for (var j = 0; j < ordersdata.length; j++) {

      await this.database.executeSql('UPDATE Orders set IsSync = ? WHERE UserId = ? AND Id = ?',
       [1,ordersdata[j].UserId,ordersdata[j].OrderId]).then(()=>{
                  console.log("updated");
          
                  },    function(error) {
                        console.log('updated error: ' + error.message);
        });
   }

   return "done";
 }
} 
