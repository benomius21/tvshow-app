import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { Service } from '../service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  header = true;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private service: Service
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['', Validators.minLength(3)]
    });

    this.subscriptions.push(this.service.isHeader.subscribe(resp => {
       this.header = resp;
    }));

    this.subscriptions.push(this.service.searchKeywordChange.pipe(
      debounceTime(1000),
      tap(() => this.service.search())
    ).subscribe());

    // this.search();
  }

  search() {
    this.service.searchKeywordChange.next(this.searchForm.get('search').value);
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
