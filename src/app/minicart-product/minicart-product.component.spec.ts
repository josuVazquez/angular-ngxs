import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinicartProductComponent } from './minicart-product.component';

describe('MinicartProductComponent', () => {
  let component: MinicartProductComponent;
  let fixture: ComponentFixture<MinicartProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinicartProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinicartProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
