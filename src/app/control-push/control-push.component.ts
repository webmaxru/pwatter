import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ConfigService } from './../config.service';

import { Observable } from 'rxjs/Observable';
import { Tweet } from '../tweet'

declare const fetch;
declare const navigator;


import { NgServiceWorker } from '@angular/service-worker';

@Component({
  selector: 'app-control-push',
  templateUrl: './control-push.component.html',
  styleUrls: ['./control-push.component.css']
})
export class ControlPushComponent implements OnInit {

  private swScope: string = './';
  private API_URL: string;
  private convertedVapidKey: any;
  private vapidPublicKey = 'BHe82datFpiOOT0k3D4pieGt1GU-xx8brPjBj0b22gvmwl-HLD1vBOP1AxlDKtwYUQiS9S-SDVGYe_TdZrYJLw8';

  private snackBarDuration: number = 2000;

  tweets: Tweet[] = [];

  constructor(public sw: NgServiceWorker, private configService: ConfigService, public snackBar: MdSnackBar) {
  }

  ngOnInit() {

    this.API_URL = this.configService.get('API_URL')

  }

  subscribeToPush() {

    this.convertedVapidKey = this.urlBase64ToUint8Array(this.vapidPublicKey);

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .subscribe({ userVisibleOnly: true, applicationServerKey: this.convertedVapidKey })
          .then(subscription => {

            this.addSubscriber(subscription)

          });

      })
      .catch(err => {
        console.log(err);
      })

  }

  unsubscribeFromPush() {

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .getSubscription()
          .then(subscription => {

            this.deleteSubscriber(subscription)

          })

      })
      .catch(err => {
        console.log(err);
      })

  }

  subscribeToPushNGSW(): void {

    this
      .sw
      .registerForPush({ applicationServerKey: this.vapidPublicKey })
      .subscribe(subscription => {

        console.log('[App] Subscription object received', subscription)

        this.addSubscriber(subscription)

      });

    this
      .sw
      .push
      .subscribe(res => {
        console.log('[App] Push message received', res)
        this.tweets.push({
          id_str: res.notification.tag,
          text: res.notification.body,
          created_at: res.notification.data.retweet_count,
          user: {
            name: res.notification.title,
            profile_image_url_https: res.notification.icon
          },
          favorite_count: res.notification.data.favorite_count,
          retweet_count: res.notification.data.retweet_count
        })
      });

  }


  // REFACTOR: Move to push-backend.service.ts

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  addSubscriber(subscription) {

    fetch(`${this.API_URL}/webpush`, {
      method: "POST",
      body: JSON.stringify({ action: 'subscribe', subscription: subscription }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('[App] Subscription request answer', json)

        let snackBarRef = this.snackBar.open('Now you are subscribed', null, {
          duration: this.snackBarDuration
        });
      })
      .catch(err => {
        console.log('[App] Subscription request failed', err)
      });

  }

  deleteSubscriber(subscription) {

    fetch(this.API_URL + '/webpush', {
      method: "POST",
      body: JSON.stringify({ action: 'unsubscribe', subscription: subscription }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('[App] Unsubscription request answer', json)

        subscription.unsubscribe()
          .then(success => {
            console.log('[App] Unsubscription successful', success)

            let snackBarRef = this.snackBar.open('Now you are unsubscribed', null, {
              duration: this.snackBarDuration
            });
          })
          .catch(err => {
            console.log('[App] Unsubscription failed', err)
          })

      })
      .catch(err => {
        console.log('[App] Unsubscription request failed', err)
      });

  }


}
