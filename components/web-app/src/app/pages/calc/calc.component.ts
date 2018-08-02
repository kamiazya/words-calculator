import { BehaviorSubject } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MatChipInputEvent } from '@angular/material/chips';

interface Word {
  name: string;
  np: 'nega' | 'posi';
}

interface Result {
  word: string;
  similarity: number;
}


@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {

  constructor(
    @Inject(HttpClient) private http: HttpClient,
  ) { }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  words$ = new BehaviorSubject<Word[]>([]);


  results$ = new BehaviorSubject<Result[]>([{word: 'hoge', similarity: 0.8}, {word: 'fuga', similarity: 0.4}]);

  message: string;

  negaposi(word: Word) {
    const words = this.words$.value;
    const index = words.findIndex(w => w.name === word.name);

    if (index >= 0) {
      words.splice(index, 1);
    }
    let negaposi: 'posi' | 'nega';
    if (word.np === 'nega') {
      negaposi = 'posi';
    } else {
      negaposi = 'nega';
    }
    words.splice(index, 0, {
      name: word.name,
      np: negaposi,
    });

    this.words$.next(words);
  }

  ngOnInit() {

    let sub: any;

    this.words$.subscribe((words) => {
      if (words.length !== 0) {
        if (sub) {
          sub.unsubscribe();
        }
        sub = this.http.post('/api/calc', {
          positive: words
            .filter(w => w.np === 'posi')
            .map(w => w.name),
          negative: words
            .filter(w => w.np === 'nega')
            .map(w => w.name),
        }).subscribe({
          next: (res) => {
            this.message = '';
            this.results$.next(res['results']);
          },
          error: () => {
            this.message = 'その単語は使えません。';
          }
        });
      } else {
        this.results$.next([]);
      }
    });
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const words = this.words$.value;
    if ((value || '').trim()) {
      words.push({name: value.trim(), np: 'posi'});
    }
    this.words$.next(words);

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(word: Word): void {
    const words = this.words$.value;
    const index = words.findIndex(w => w.name === word.name);

    if (index >= 0) {
      words.splice(index, 1);
    }
    this.words$.next(words);
  }
}
