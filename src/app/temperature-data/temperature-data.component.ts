import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { TemperatureService } from '../temperature.service';

@Component({
  selector: 'app-temperature-data',
  templateUrl: './temperature-data.component.html',
  styleUrls: ['./temperature-data.component.css']
})
export class TemperatureDataComponent implements OnChanges, OnInit {
  @Input() showData: boolean = false;
  temperatureData: any[] = [];

  constructor(private temperatureService: TemperatureService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showData'] && this.showData) {
      this.fetchTemperatureData();
    } else {
      this.temperatureData = [];
    }
  }

  fetchTemperatureData(): void {
    this.temperatureService.getTemperatureData().subscribe(
      (data) => {
        this.temperatureData = data;
      },
      (error) => {
        console.error('Error fetching temperature data', error);
      }
    );
  }
}
