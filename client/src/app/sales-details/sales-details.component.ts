import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Sales } from './../sales';
import { environment } from 'src/environments/environment';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.scss']
})
export class SalesDetailsComponent implements OnInit {

  socket = io(environment.socketIoRoot);

  salesDetails$: Observable<Sales>;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {
    this.salesDetails$ = this.api.getSalesById(this.route.snapshot.params.id);

  }

  ngOnInit(): void {
    this.getSalesDetails(this.route.snapshot.params.id);

    this.socket.on('update-data', function(data: any) {
      if (data.data._id === this.route.snapshot.params.id) {
        this.salesDetails$ = of(data.data);
      }
    }.bind(this));
  }


  getSalesDetails(id: string) {
  }

  deleteSales(id: any) {
    this.api.deleteSales(id)
      .subscribe(res => {
          this.router.navigate(['/']);
        }, (err) => {
          console.log(err);
        }
      );
  }

}
