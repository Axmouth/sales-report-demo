import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from '../api.service';
import { Sales } from '../sales';
import { Chart } from '../chart';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  chartTypes: ChartType[] = ['pie', 'line', 'bar', 'horizontalBar', 'radar', 'doughnut', 'polarArea'];
  chartType: ChartType = this.chartTypes[0];

  socket = io(environment.socketIoRoot);

  chartData: Chart[] = [];

  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public chartLabels: Label[] = [];
  public shownChartData: number[] = [];
  public chartLegend = true;
  public chartPlugins = [pluginDataLabels];
  public chartColors = [];

  displayedColumns: string[] = ['itemId', 'itemName', 'totalPrice'];
  data: Sales[] = [];
  isLoadingResults = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getSales();
    this.getChartData();

    this.socket.on('update-data', function(data: any) {
      this.getSales();
      this.getChartData();
    }.bind(this));
  }

  getSales() {
    this.api.getSales()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  getChartData() {
    this.api.getChart()
    .subscribe((res: any) => {
      console.log(res);
      this.chartData = res;
      this.chartLabels = [];
      this.shownChartData = [];
      this.chartColors = [];
      const backgrounds = [];
      this.chartData.forEach((ch, idx) => {
        this.chartLabels.push(ch._id.itemName);
        this.shownChartData.push(ch.totalPrice);
        backgrounds.push(`rgba(${0 + (idx * 10)}, ${255 - (idx * 20)}, ${0 + (idx * 10)}, 0.3)`);
      });
      this.chartColors = [
        {
          backgroundColor: backgrounds
        }
      ];
    }, err => {
      console.log(err);
    });
  }

}
