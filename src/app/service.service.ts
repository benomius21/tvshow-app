import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Params} from '@angular/router';
import { SearchModel } from './single-video/search.model';

export enum ShowType {
    TV = 'tv',
    MOVIE = 'movie'
}
@Injectable()
export class Service {
    singleVideoData;
    movies:[] = [];
    trailer: SearchModel;
    isHeader = new Subject<boolean>();
    trailerData = new Subject<SearchModel>();
    singleData = new Subject<{}>();
    videoData = new BehaviorSubject<[]>(this.movies);
    show: string;
    searchKeywordChange = new BehaviorSubject<string>('');

    apiUrl = 'https://api.themoviedb.org/3/';
    apiKey = '0faa38712671d829d45de7da3d172fee';

    constructor(private http: HttpClient) { }

    topMovies(show: string): void {
        if(!this.show){
            return;
        }
        const url = `${this.apiUrl}${show}/top_rated?api_key=${this.apiKey}`;
        this.http.get<{ results, status_message: string }>(url)
            .subscribe(resp => {
                this.movies = resp.results.slice(0, -10);
                this.videoData.next(this.movies);
            });
    }

    search(): void {
        const query = this.searchKeywordChange.getValue();
        const show = this.show;
        // this.keyWord.next(query);
        if (query.length < 3) {
            this.topMovies(show);
            return;
        }
        const url = `${this.apiUrl}search/${show}?api_key=${this.apiKey}&query=`;
        this.http.get<{ page: number, results, total_results: number, total_pages: number }>(url + query)
            .subscribe(resp => {
                this.movies = resp.results;
                this.videoData.next(this.movies);
            });
    }

    singleVideo(show: string, id: Params): void {
        const url = `${this.apiUrl}${show}/${id}?api_key=${this.apiKey}&language=en-US`;
        this.http.get<{}>(url)
            .subscribe(resp => {
                this.singleVideoData = resp;
                this.singleData.next(this.singleVideoData);
            });
    }
    getTrailer(show: string, id: Params): void {
        const url = `${this.apiUrl}${show}/${id}/videos?api_key=${this.apiKey}&language=en-US`;
        this.http.get<{ results: SearchModel[] }>(url)
            .subscribe(resp => {
                this.trailer = resp.results[0];
                this.trailerData.next(this.trailer);
            });
    }
}

