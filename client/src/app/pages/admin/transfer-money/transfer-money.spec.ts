import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMoney } from './transfer-money';

describe('TransferMoney', () => {
  let component: TransferMoney;
  let fixture: ComponentFixture<TransferMoney>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferMoney]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferMoney);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
