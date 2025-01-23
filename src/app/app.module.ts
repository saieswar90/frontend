import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LedControlComponent } from './led-control/led-control.component';
import { TemperatureDataComponent } from './temperature-data/temperature-data.component';
import { TemperatureService } from './temperature.service';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component';
import { SoilMoistureDataComponent } from './soil-moisture-data/soil-moisture-data.component';
import { SoilMoistureChartComponent } from './soil-moisture-chart/soil-moisture-chart.component'; // Import the chart component
import { MotionService } from './motion.service';

  // Import the MotionService

@NgModule({
  declarations: [
    AppComponent,
    LedControlComponent,
    TemperatureDataComponent,
    TemperatureChartComponent,
    SoilMoistureDataComponent,
    SoilMoistureChartComponent,
 // Declare the chart component
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Ensure HttpClientModule is imported for API calls
  ],
  providers: [
    TemperatureService,
    MotionService,  // Add MotionService to providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }