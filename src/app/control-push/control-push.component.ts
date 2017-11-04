import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Tweet } from '../tweet'

import { ConfigService } from './../config.service';
import { PushService } from './../push.service';

import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-control-push',
  templateUrl: './control-push.component.html',
  styleUrls: ['./control-push.component.css']
})
export class ControlPushComponent implements OnInit {

  private VAPID_PUBLIC_KEY: string;
  private snackBarDuration: number = 2000

  tweets = []

  constructor(private pushService: PushService, public snackBar: MatSnackBar, private configService: ConfigService, private swPush: SwPush) {
  }

  ngOnInit() {
    this.VAPID_PUBLIC_KEY = this.configService.get('VAPID_PUBLIC_KEY')
  }

  subscribeToPush() {

    // Requesting messaging service to subscribe current client (browser)

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(pushSubscription => {

        // Passing subscription object to our backend

        this.pushService.addSubscriber(pushSubscription)
          .subscribe(

          res => {
            console.log('[App] Add subscriber request answer', res)

            let snackBarRef = this.snackBar.open('Now you are subscribed', null, {
              duration: this.snackBarDuration
            });
          },
          err => {
            console.log('[App] Add subscriber request failed', err)
          }

          )
      })
      .catch(err => {
        console.error(err);
      })

  }

  unsubscribeFromPush() {

    // Get active subscription

    this.swPush.subscription
      .take(1)
      .subscribe(pushSubscription => {

        console.log('[App] pushSubscription', pushSubscription)

        // Delete the subscription from the backend

        this.pushService.deleteSubscriber(pushSubscription)
          .subscribe(

          res => {
            console.log('[App] Delete subscriber request answer', res)

            let snackBarRef = this.snackBar.open('Now you are unsubscribed', null, {
              duration: this.snackBarDuration
            });

            // Unsubscribe current client (browser)

            pushSubscription.unsubscribe()
              .then(success => {
                console.log('[App] Unsubscription successful', success)
              })
              .catch(err => {
                console.log('[App] Unsubscription failed', err)
              })

          },
          err => {
            console.log('[App] Delete subscription request failed', err)
          }

          )

      })

  }

  showMessages() {

    this.swPush.messages
      .subscribe(message => {

        console.log('[App] Push message received', message)

        let notification = message['notification']

        this.tweets.unshift({
          text: notification['body'],
          id_str: notification['tag'],
          favorite_count: notification['data']['favorite_count'],
          retweet_count: notification['data']['retweet_count'],
          user: {
            name: notification['title']
          }
        })

      })

  }


}
