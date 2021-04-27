import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Service, ShowType } from '../service.service';

@Component({
  selector: 'app-tvshows',
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.css']
})
export class TvshowsComponent implements OnInit, OnDestroy {
  tvShows;
  unSub: Subscription;
  isPicture: boolean = false;
  
  constructor(private service: Service) { }

  ngOnInit(): void {
    this.unSub = this.service.videoData.subscribe(resp => {
      this.tvShows = resp;
      
    });
    this.service.isHeader.next(true);
    this.service.show = ShowType.TV;
    this.service.search();
  }

  ngOnDestroy(): void {
    this.unSub.unsubscribe();
  }
}
