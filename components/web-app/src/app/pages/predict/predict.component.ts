import { BehaviorSubject } from 'rxjs';

import { Component, OnInit, Inject } from '@angular/core';

import { FormControl } from '@angular/forms';

import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.css']
})
export class PredictComponent implements OnInit {

  constructor(
    @Inject(HttpClient) private http: HttpClient,
  ) { }

  infoCtrl = new FormControl();

  estimates$ = new BehaviorSubject([]);

  ngOnInit() {

    let sub: any;

    this.infoCtrl.valueChanges.subscribe((info) => {
      if (info !== '') {
        if (sub) {
          sub.unsubscribe();
        }
        let params = new HttpParams();
        params = params.set('q', info);
        sub = this.http.get('/api/predict', { params }).subscribe((res) => {
          this.estimates$.next(res['estimates']);
        });
      } else {
        this.estimates$.next([]);
      }
    });
  }

}
