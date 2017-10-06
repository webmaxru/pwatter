import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { Tweet } from '../tweet'
import { TweetService } from './../tweet.service';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.css']
})
export class TweetListComponent implements OnInit {

  @Input()
  tweets: Tweet[];

  constructor() { }

  ngOnInit() {
  }

}
