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
    chartData$: Observable < number[] > ;
    data$: Observable < Sales[] > ;

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
              console.log('newAr');
              let idx = 0;
              const backgrounds = [];
              this.chartLabels = [];
              this.shownChartData = [];
              const newAr = chArray.map(ch => {
                  this.chartLabels.push(ch._id.itemName);
                  this.shownChartData.push(ch.totalPrice);
                  // tslint:disable-next-line:max-line-length
                  backgrounds.push(`rgba(${0 + (idx * 75 + 50) % 255}, ${255 - (idx * 50 + 20) % 255}, ${0 + (idx * 100 + 150) % 255}, 0.6)`);
                  idx++;
                  return ch.totalPrice;
              });
              this.chartColors = [{
                backgroundColor: backgrounds
              }];
              console.log(newAr);
              return newAr;
          }));
    }

}
