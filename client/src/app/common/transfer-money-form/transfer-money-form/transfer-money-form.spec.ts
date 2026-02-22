import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMoneyForm } from './transfer-money-form';

describe('TransferMoneyForm', () => {
  let component: TransferMoneyForm;
  let fixture: ComponentFixture<TransferMoneyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferMoneyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferMoneyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
