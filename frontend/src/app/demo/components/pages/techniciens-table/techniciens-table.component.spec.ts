import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniciensTableComponent } from './techniciens-table.component';

describe('TechniciensTableComponent', () => {
  let component: TechniciensTableComponent;
  let fixture: ComponentFixture<TechniciensTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechniciensTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechniciensTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
