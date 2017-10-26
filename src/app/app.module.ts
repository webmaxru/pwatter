import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import 'hammerjs';

import { AppComponent } from './app.component';

import { ConfigService } from './config.service';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { TweetFeedsComponent } from './tweet-feeds/tweet-feeds.component';

import { PostTweetComponent } from './post-tweet/post-tweet.component';
import { ControlPushComponent } from './control-push/control-push.component';
import { ControlBroadcastComponent } from './control-broadcast/control-broadcast.component';

import { TweetService } from './tweet.service';

import { WindowRef } from './window-ref';

import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment';

import { SwUpdatesModule } from './sw-updates/sw-updates.module';
import { ControlNgswComponent } from './control-ngsw/control-ngsw.component';


@NgModule({
  declarations: [
    AppComponent,
    TweetListComponent,
    PostTweetComponent,
    ControlPushComponent,
    TweetFeedsComponent,
    ControlBroadcastComponent,
    ControlNgswComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MaterialModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    SwUpdatesModule
  ],
  providers: [
    ConfigService,
    TweetService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
