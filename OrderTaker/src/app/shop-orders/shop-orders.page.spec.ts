import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopOrdersPage } from './shop-orders.page';

describe('ShopOrdersPage', () => {
  let component: ShopOrdersPage;
  let fixture: ComponentFixture<ShopOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
