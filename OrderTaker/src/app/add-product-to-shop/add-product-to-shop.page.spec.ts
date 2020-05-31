import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProductToShopPage } from './add-product-to-shop.page';

describe('AddProductToShopPage', () => {
  let component: AddProductToShopPage;
  let fixture: ComponentFixture<AddProductToShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductToShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductToShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
