import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ConfigService } from './config.service';

import { Tweet } from './tweet'

@Injectable()
export class TweetService {

  private API_URL: string

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.API_URL = this.configService.get('API_URL')
  }

  getTimelineTweets(): Observable<any> {
    const url = `${this.API_URL}/timeline`;
    console.log('[Tweet Service] Requesting timeline')
    return this.http
      .get(url)
      .catch(this.handleError);

  }

  getFavoriteTweets(): Observable<any> {
    const url = `${this.API_URL}/favorites`;
    console.log('[Tweet Service] Requesting favorites')
    return this.http
      .get(url)
      .catch(this.handleError);
  }

  postTweet(message: string): Observable<any> {
    const url = `${this.API_URL}/post-tweet`;
    console.log('[Tweet Service] Posting tweet')

    return this.http
      .post(url, { message })
      .catch(this.handleError);
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
