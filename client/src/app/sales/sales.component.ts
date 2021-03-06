import {
    Component,
    OnInit
} from '@angular/core';
import * as io from 'socket.io-client';
import {
    ChartType,
    ChartOptions
} from 'chart.js';
import {
    Label
} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {
    ApiService
} from '../api.service';
import {
    Sales
} from '../sales';
import {
    Chart
} from '../chart';
import {
    environment
} from 'src/environments/environment';
import {
    Observable
} from 'rxjs';
import {
    map
} from 'rxjs/operators';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

    chartTypes: ChartType[] = ['pie', 'line', 'bar', 'horizontalBar', 'radar', 'doughnut', 'polarArea'];
    chartType: ChartType = this.chartTypes[0];

    socket = io(environment.socketIoRoot);

    // chartData: Chart[] = [];
    chartData$: Observable<number[]>;
    data$: Observable<Sales[]>;

    chartContainerHeight = 450;

    public chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
    isLoadingResults = true;

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
        this.getSales();
        this.getChartData();

        this.socket.on('update-data', function(data: any) {
            this.getSales();
            this.getChartData();
        }.bind(this));
    }

    getSales() {
      this.data$ = this.api.getSales();
    }

    getChartData() {
      this.chartData$ = this.api.getChart().pipe(
          map(chArray => {
              let idx = 0;
              const backgrounds = [];
              this.chartLabels = [];
              this.shownChartData = [];
              const priceSum = chArray.reduce((a, b) => a + b.totalPrice, 0);
              const newAr = chArray.map(ch => {
                  this.chartLabels.push(ch._id.itemName);
                  this.shownChartData.push(ch.totalPrice);
                  backgrounds.push(`hsl(${(priceSum + idx * 70) % 360 }, 100%, 75%)`); // Laura ™
                  idx++;
                  return ch.totalPrice;
              });
              this.chartColors = [{
                backgroundColor: backgrounds
              }];
              return newAr;
          }));
    }

}
