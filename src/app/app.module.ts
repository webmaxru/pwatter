import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import 'hammerjs';

import { AppComponent } from './app.component';

import { ConfigService } from './config.service';
import { PushService } from './push.service';
import { TweetService } from './tweet.service';

import { ControlNgswComponent } from './control-ngsw/control-ngsw.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { TweetFeedsComponent } from './tweet-feeds/tweet-feeds.component';

import { ControlPushComponent } from './control-push/control-push.component';
import { ControlBroadcastComponent } from './control-broadcast/control-broadcast.component';

import { WindowRef } from './window-ref';

import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    TweetListComponent,
    ControlPushComponent,
    TweetFeedsComponent,
    ControlBroadcastComponent,
    ControlNgswComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [
    ConfigService,
    TweetService,
    PushService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
