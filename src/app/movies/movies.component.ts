import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Service, ShowType } from '../service.service';
import { MovieModel } from './movies.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit, OnDestroy {
  movies: MovieModel[] = [];
  sub: Subscription;
  constructor(private service: Service) { }

  ngOnInit(): void {
    this.sub = this.service.videoData.subscribe(resp => {
      this.movies = resp;
    });
    this.service.isHeader.next(true);
    this.service.show = ShowType.MOVIE;
    this.service.search();
  
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
