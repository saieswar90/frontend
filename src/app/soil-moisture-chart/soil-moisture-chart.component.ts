import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-soil-moisture-chart',
  templateUrl: './soil-moisture-chart.component.html',
  styleUrls: ['./soil-moisture-chart.component.css']
})
export class SoilMoistureChartComponent implements OnChanges {
  @Input() soilMoistureData: any[] = [];
  chart: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['soilMoistureData'] && this.soilMoistureData.length > 0) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const timestamps = this.soilMoistureData.map(data => data.timestamp);
    const soilMoistureValues = this.soilMoistureData.map(data => data.soilMoisture);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('soilMoistureChart', {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Soil Moisture',
            data: soilMoistureValues,
            borderColor: 'green',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Timestamp' }},
          y: { title: { display: true, text: 'Soil Moisture Value' }}
        }
      }
    });
  }
}
