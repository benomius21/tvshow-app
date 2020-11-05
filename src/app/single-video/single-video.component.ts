import { Location } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Service } from '../service.service';
import { SearchModel } from './search.model';
import { SingleVideoModel } from './singleVideo.model';

@Component({
  selector: 'app-single-video',
  templateUrl: './single-video.component.html',
  styleUrls: ['./single-video.component.css']
})
export class SingleVideoComponent implements OnInit, OnDestroy {
  data: SingleVideoModel;
  id: Params;
  show: string;
  video: SearchModel;
  trailer;
  subscriptions: Subscription[] = [];
  constructor(
    private service: Service,
    private route: ActivatedRoute,
    private location: Location,
    private sanitizer: DomSanitizer,

  ) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    const link = this.location.path();
    const editLink = link.split('/');
    if (editLink[1] === 'movie') {
      this.service.singleVideo('movie', this.id);
      this.service.getTrailer('movie', this.id);
    } else {
      this.service.singleVideo('tv', this.id);
      this.service.getTrailer('tv', this.id);

    }
    this.subscriptions.push(this.service.trailerData.subscribe(resp => {
      this.video = resp;
      if(!this.video){
        return;
      }
      let url = "https://www.youtube.com/embed/" + this.video.key;
      this.trailer = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }));
    
    this.subscriptions.push(this.service.singleData.subscribe(resp => {
      this.data = resp;
    }));
    this.service.isHeader.next(false);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
