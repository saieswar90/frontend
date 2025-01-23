import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilMoistureChartComponent } from './soil-moisture-chart.component';

describe('SoilMoistureChartComponent', () => {
  let component: SoilMoistureChartComponent;
  let fixture: ComponentFixture<SoilMoistureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoilMoistureChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilMoistureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
