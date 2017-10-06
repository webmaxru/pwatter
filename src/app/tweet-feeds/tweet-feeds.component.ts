import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { Tweet } from '../tweet'
import { TweetService } from './../tweet.service';

@Component({
  selector: 'app-tweet-feeds',
  templateUrl: './tweet-feeds.component.html',
  styleUrls: ['./tweet-feeds.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TweetFeedsComponent implements OnInit {

  private snackBarDuration: number = 2000
  isInteractionStarted: boolean = false

  tweets$: Observable<Tweet[]>

  constructor(private tweetService: TweetService, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  loadTimeLine() {

    this.isInteractionStarted = true

    this.tweets$ = this.tweetService
      .getTimelineTweets()
      .catch((err): any => {
        let snackBarRef = this.snackBar.open(err, null, {
          duration: this.snackBarDuration
        });
      })

  }

  loadFavorites() {

    this.isInteractionStarted = true

    this.tweets$ = this.tweetService
      .getFavoriteTweets()
      .catch((err): any => {
        let snackBarRef = this.snackBar.open(err, null, {
          duration: this.snackBarDuration
        });
      })

  }

}
