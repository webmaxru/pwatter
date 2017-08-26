import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppComponent } from './app.component';

import { ConfigService } from './config.service';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { PostTweetComponent } from './post-tweet/post-tweet.component';
import { ControlPushComponent } from './control-push/control-push.component';

import { TweetService } from './tweet.service';

import {WindowRef} from './window-ref';

import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [
    AppComponent,
    TweetListComponent,
    PostTweetComponent,
    ControlPushComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ServiceWorkerModule
  ],
  providers: [
    ConfigService,
    TweetService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
