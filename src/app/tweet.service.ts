import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ConfigService } from './config.service';

import { Tweet } from './tweet'


@Injectable()
export class TweetService {

  private API_URL: string

  constructor(private http: Http, private configService: ConfigService) {
    this.API_URL = this.configService.get('API_URL')
  }

  getTimelineTweets(): Observable<any> {
    const url = `${this.API_URL}/timeline`;
    console.log('[App Service] Requesting timeline')
    return this.http
      .get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFavoriteTweets(): Observable<any> {
    const url = `${this.API_URL}/favorites`;
    console.log('[App Service] Requesting favorites')
    return this.http
      .get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postTweet(message: string): Observable<any> {
    const url = `${this.API_URL}/post-tweet`;
    console.log('[App Service] Posting tweet')

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(url, { message }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.statusText || 'Network error'}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
