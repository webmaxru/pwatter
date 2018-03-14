import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Tweet } from '../tweet'
import { TweetService } from './../tweet.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrls: ['./post-tweet.component.css']
})
export class PostTweetComponent implements OnInit {

  message;
  private snackBarDuration: number = 2000;
  subscription: Subscription;
  

  constructor(private tweetService: TweetService, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  messageFormSubmit(messageForm: any) {

    if (messageForm.valid) {

      this.subscription = this.tweetService.postTweet(messageForm.value.message).subscribe(
        res => {
          console.log('[App] Tweet was posted', res)
          let snackBarRef = this.snackBar.open('Tweet was posted', null, {
            duration: this.snackBarDuration
          });
        },
        err => {
          let snackBarRef = this.snackBar.open('Tweet will be posted after you go online', null, {
            duration: this.snackBarDuration
          });
        });

      messageForm.reset()

    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
