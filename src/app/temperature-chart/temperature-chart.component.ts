import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.css']
})
export class TemperatureChartComponent implements OnChanges {
  @Input() temperatureData: any[] = [];
  chart: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['temperatureData'] && this.temperatureData.length > 0) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const timestamps = this.temperatureData.map(data => data.timestamp);
    const temperatures = this.temperatureData.map(data => data.temperature);
    const humidity = this.temperatureData.map(data => data.humidity);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'Humidity (%)',
            data: humidity,
            borderColor: 'blue',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Timestamp'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            },
            ticks: {
              stepSize: 10,
            },
          }
        }
      }
    });
  }
}
