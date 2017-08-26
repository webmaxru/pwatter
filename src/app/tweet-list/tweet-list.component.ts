import { Component, OnInit } from '@angular/core';

import { MdSnackBar } from '@angular/material';

import { Tweet } from '../tweet'
import { TweetService } from './../tweet.service';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.css']
})
export class TweetListComponent implements OnInit {

  tweets: Tweet[] = []
  private snackBarDuration: number = 2000
  isDataLoading: boolean = false

  constructor(private tweetService: TweetService, public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  loadTimeLine() {

    this.isDataLoading = true
    this.tweets = []

    this.tweetService.getTimelineTweets()
      .subscribe(
      response => {
        this.tweets = response
        this.isDataLoading = false
      },
      error => {
        let snackBarRef = this.snackBar.open(error, null, {
          duration: this.snackBarDuration
        });
      }
      );

  }

  loadFavorites() {

    this.isDataLoading = true
    this.tweets = []

    this.tweetService.getFavoriteTweets()
      .subscribe(
      response => {
        this.tweets = response
        this.isDataLoading = false
      },
      error => {
        let snackBarRef = this.snackBar.open(error, null, {
          duration: this.snackBarDuration
        });
      }
      );

  }

}
