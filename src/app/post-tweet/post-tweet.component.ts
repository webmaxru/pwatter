import { Component, OnInit } from '@angular/core';
import { Tweet } from '../tweet'
import { TweetService } from './../tweet.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrls: ['./post-tweet.component.css']
})
export class PostTweetComponent implements OnInit {

  message;

  constructor(private tweetService: TweetService, public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  messageFormSubmit(messageForm: any) {

    if (messageForm.valid) {

      this.tweetService.postTweet(messageForm.value.message).subscribe(
        res => {
          console.log('[App] Tweet was posted', res)
          let snackBarRef = this.snackBar.open('Tweet was posted', null, {
            duration: 2000
          });
        },
        err => {
          let snackBarRef = this.snackBar.open('Tweet will be posted after you go online', null, {
            duration: 2000
          });
        });

      messageForm.reset()

    }

  }

}
