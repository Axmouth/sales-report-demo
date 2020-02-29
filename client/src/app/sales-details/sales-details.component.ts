import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Sales } from './../sales';
import { socketIoRoot } from '../app-constants';

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.scss']
})
export class SalesDetailsComponent implements OnInit {

  socket = io(socketIoRoot);

  sales: Sales = { _id: '', itemId: '', itemName: '', itemPrice: null, itemQty: null, totalPrice: null, updated: null };
  isLoadingResults = true;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getSalesDetails(this.route.snapshot.params.id);

    this.socket.on('update-data', function(data: any) {
      this.getSalesDetails();
    }.bind(this));
  }

  getSalesDetails(id: string) {
    this.api.getSalesById(id)
      .subscribe((data: any) => {
        this.sales = data;
        console.log(this.sales);
        this.isLoadingResults = false;
      });
  }

  deleteSales(id: any) {
    this.isLoadingResults = true;
    this.api.deleteSales(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.router.navigate(['/']);
          this.socket.emit('updatedata', res);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

}
