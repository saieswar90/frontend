import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { SoilMoistureService } from '../soil-moisture.service';

@Component({
  selector: 'app-soil-moisture-data',
  templateUrl: './soil-moisture-data.component.html',
  styleUrls: ['./soil-moisture-data.component.css']
})
export class SoilMoistureDataComponent implements OnChanges, OnInit {
  @Input() showData: boolean = false;
  soilMoistureData: any[] = [];

  constructor(private soilMoistureService: SoilMoistureService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showData'] && this.showData) {
      this.fetchSoilMoistureData();
    } else {
      this.soilMoistureData = [];
    }
  }

  fetchSoilMoistureData(): void {
    this.soilMoistureService.getSoilMoistureData().subscribe(
      (data) => {
        this.soilMoistureData = data;
      },
      (error) => {
        console.error('Error fetching soil moisture data', error);
      }
    );
  }
}
