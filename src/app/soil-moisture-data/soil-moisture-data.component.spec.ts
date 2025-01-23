import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilMoistureDataComponent } from './soil-moisture-data.component';

describe('SoilMoistureDataComponent', () => {
  let component: SoilMoistureDataComponent;
  let fixture: ComponentFixture<SoilMoistureDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoilMoistureDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilMoistureDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
