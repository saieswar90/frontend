import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-led-control',
  templateUrl: './led-control.component.html',
  styleUrls: ['./led-control.component.css']
})
export class LedControlComponent implements OnInit {
  showTemperatureData: boolean = false;
  showSoilMoistureData: boolean = false;
  showMotionData: boolean = false;
  showClimateMeasures: boolean = false;
  motionData: any[] = [];
  motionStatus: string | undefined;
  climateData: any[] = [];
  climateAvgTemp: number | undefined;
  climateAvgHumidity: number | undefined;
  climateAvgDewPoint: number | undefined;
  sidebarOpen: boolean = false;
  showWelcomeContent: boolean = true;

  // Agricultural Measures
  vaporPressure: number | undefined;
  vpd: number | undefined;
  heatIndex: number | undefined;
  dewPoint: number | undefined;
  cropWaterStressIndex: number | undefined;
  chillHours: number | undefined;
  growingDegreeDays: number | undefined;
  evapotranspiration: number | undefined;
  potentialEvapotranspiration: number | undefined;
  moistureStressIndex: number | undefined;

  @ViewChild('motionDataSection') motionDataSection!: ElementRef;
  @ViewChild('temperatureDataSection') temperatureDataSection!: ElementRef;
  @ViewChild('soilMoistureDataSection') soilMoistureDataSection!: ElementRef;
  @ViewChild('climateDataSection') climateDataSection!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  // Modified startJourney method to open sidebar and hide welcome content
  startJourney() {
    this.showWelcomeContent = false;
    this.sidebarOpen = true;
    
  }

  // Sidebar toggle method, for manual toggling
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    // Hide the welcome content if sidebar is opened, else show it
    this.showWelcomeContent = !this.sidebarOpen;
  }

  fetchMotionData() {
    this.http.get<any>('https://myserver-1.onrender.com/motion')
      .subscribe(
        (response) => {
          this.motionData = response.slice(0, 10);
          this.motionStatus = response.length > 0 ? response[0].motion : 'No Motion Data';
        },
        (error) => {
          console.error('Error fetching motion data', error);
          this.motionStatus = 'Error fetching motion data';
        }
      );
  }

  toggleMotionData() {
    this.showMotionData = !this.showMotionData;
    if (this.showMotionData) {
      this.fetchMotionData();
    } else {
      this.motionData = [];
      this.motionStatus = undefined;
    }
  }

  toggleTemperatureData() {
    this.showTemperatureData = !this.showTemperatureData;
  }

  toggleSoilMoistureData() {
    this.showSoilMoistureData = !this.showSoilMoistureData;
  }

  toggleClimateMeasures() {
    this.showClimateMeasures = !this.showClimateMeasures;
    if (this.showClimateMeasures) {
      this.fetchClimateData(); // Fetch climate data when this section is toggled
    }
  }

  fetchClimateData() {
    this.http.get<any>('https://myserver-1.onrender.com/climate')
      .subscribe(
        (response) => {
          this.climateData = response.slice(0, 10); // Assuming response is an array of climate data objects
          this.calculateClimateAverages();
          this.calculateAgriculturalMeasures(); // Calculate all agricultural measures
        },
        (error) => {
          console.error('Error fetching climate data', error);
        }
      );
  }

  // Calculate averages from climate data (Temperature, Humidity, Dew Point)
  calculateClimateAverages() {
    if (this.climateData.length > 0) {
      const totalTemperature = this.climateData.reduce((acc, data) => acc + data.temperature, 0);
      const totalHumidity = this.climateData.reduce((acc, data) => acc + data.humidity, 0);
      const totalDewPoint = this.climateData.reduce((acc, data) => acc + this.calculateDewPoint(data.temperature, data.humidity), 0);

      this.climateAvgTemp = totalTemperature / this.climateData.length;
      this.climateAvgHumidity = totalHumidity / this.climateData.length;
      this.climateAvgDewPoint = totalDewPoint / this.climateData.length; // Average Dew Point
    } else {
      this.climateAvgTemp = 0;
      this.climateAvgHumidity = 0;
      this.climateAvgDewPoint = 0;
    }
  }

  // Dew point calculation
  calculateDewPoint(temperature: number, humidity: number): number {
    return temperature - ((100 - humidity) / 5);
  }

  // Calculate all agricultural measures
  calculateAgriculturalMeasures() {
    if (this.climateAvgTemp !== undefined && this.climateAvgHumidity !== undefined) {
      // 1. Vapor Pressure
      this.vaporPressure = this.calculateVaporPressure(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 2. Vapor Pressure Deficit (VPD)
      this.vpd = this.calculateVPD(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 3. Heat Index
      this.heatIndex = this.calculateHeatIndex(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 4. Dew Point
      this.dewPoint = this.calculateDewPoint(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 5. Crop Water Stress Index (CWSI)
      this.cropWaterStressIndex = this.calculateCropWaterStressIndex(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 6. Chill Hours (e.g., if temperature is below a certain threshold for a specified period)
      this.chillHours = this.calculateChillHours(this.climateData);
  
      // 7. Growing Degree Days (GDD)
      this.growingDegreeDays = this.calculateGrowingDegreeDays(this.climateData);
      
      // 8. Evapotranspiration (ET) - Estimate or based on data
      this.evapotranspiration = this.calculateEvapotranspiration(this.climateAvgTemp, this.climateAvgHumidity);
      
      // 9. Potential Evapotranspiration (PET) - Estimate or based on data
      this.potentialEvapotranspiration = this.calculatePotentialEvapotranspiration(this.climateAvgTemp);
      
      // 10. Moisture Stress Index (MSI)
      this.moistureStressIndex = this.calculateMoistureStressIndex(this.climateAvgTemp, this.climateAvgHumidity);
    }
  }
  calculateVaporPressure(temperature: number, humidity: number): number {
    const T = temperature;
    const RH = humidity / 100;
    return 0.6108 * Math.exp((17.27 * T) / (T + 237.3)) * RH;
  }

  // Calculate Vapor Pressure Deficit (VPD)
  calculateVPD(temperature: number, humidity: number): number {
    const vaporPressure = this.calculateVaporPressure(temperature, humidity);
    const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    return saturationVaporPressure - vaporPressure;
  }

  // Calculate Heat Index
  calculateHeatIndex(temperature: number, humidity: number): number {
    // Simplified formula for Heat Index
    const T = temperature;
    const RH = humidity;
    return -8.78469475556 + 1.61139411 * T + 2.33854883889 * RH - 0.14611605 * T * RH - 0.012308094 * T * T - 0.0164248277778 * RH * RH + 0.002211732 * T * T * RH + 0.00072546 * T * RH * RH - 0.000003582 * T * T * RH * RH;
  }

  calculateCropWaterStressIndex(temperature: number, humidity: number): number {
    // Example formula for crop water stress index (CWSI)
    return Math.max(0, 1 - (humidity / 100) * (temperature / 30)); // Simplified example
  }
  
  calculateChillHours(data: any[]): number {
    // Example: Chill hours are typically counted if temperature is below a certain threshold for a set period.
    // Example logic to count chill hours (temperature below 7.2°C)
    return data.filter(item => item.temperature < 7.2).length;
  }
  
  calculateGrowingDegreeDays(data: any[]): number {
    // Example GDD calculation: GDD = max(0, T - base temperature) where T is the daily average temperature
    const baseTemperature = 10; // Assume base temperature is 10°C for this example
    return data.reduce((acc, item) => acc + Math.max(0, item.temperature - baseTemperature), 0);
  }
  
  calculateEvapotranspiration(temperature: number, humidity: number): number {
    // Example: Estimating evapotranspiration based on temperature and humidity
    return (temperature * (1 - humidity / 100)) * 0.1; // Simplified example formula
  }
  
  calculatePotentialEvapotranspiration(temperature: number): number {
    // Example formula for potential evapotranspiration
    return temperature * 0.6; // Simplified example formula
  }
  
  calculateMoistureStressIndex(temperature: number, humidity: number): number {
    // Example formula for moisture stress index (MSI)
    return (100 - humidity) / (temperature + 1); // Simplified example formula
  }

  navigateToLEDControl() {
    window.open('https://c474-2401-4900-676a-e237-9c4f-f4b0-fa45-9275.ngrok-free.app/', '_blank');
  }

  navigateToPotatoModel() {
    window.open('https://278f-61-1-167-254.ngrok-free.app/', '_blank');
  }

  captureAndPrint(sectionId: string) {}

  printMotionData() {
    this.captureAndPrint('motionDataSection');
  }
  printTemperatureData() {
    this.captureAndPrint('temperatureDataSection');
  }
  printSoilMoistureData() {
    this.captureAndPrint('soilMoistureDataSection');
  }
  printClimateData() {
    this.captureAndPrint('climateDataSection');
  }
}
