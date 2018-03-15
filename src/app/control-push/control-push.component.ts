import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Tweet } from '../tweet'

import { ConfigService } from './../config.service';
import { PushService } from './../push.service';

@Component({
  selector: 'app-control-push',
  templateUrl: './control-push.component.html',
  styleUrls: ['./control-push.component.css']
})
export class ControlPushComponent implements OnInit {

  private VAPID_PUBLIC_KEY: string;
  private snackBarDuration: number = 2000
  private swScope: string = './';

  tweets = []

  constructor(private pushService: PushService, public snackBar: MatSnackBar, private configService: ConfigService) {
  }

  ngOnInit() {
    this.VAPID_PUBLIC_KEY = this.configService.getConfig('VAPID_PUBLIC_KEY')
  }

  subscribeToPush() {

    let convertedVapidKey = this.pushService.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .subscribe({ userVisibleOnly: true, applicationServerKey: convertedVapidKey })
          .then(pushSubscription => {

            this.pushService.addSubscriber(pushSubscription)
              .subscribe(

                res => {
                  console.log('[App] Add subscriber request answer', res)

                  let snackBarRef = this.snackBar.open('Now you are subscribed', null, {
                    duration: this.snackBarDuration
                  });
                },
                err => {
                  console.error('[App] Add subscriber request failed', err)
                }

              )

          });

      })
      .catch(err => {
        console.error(err);
      })


  }

  unsubscribeFromPush() {

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .getSubscription()
          .then(pushSubscription => {

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
                  console.error('[App] Delete subscription request failed', err)
                }

              )
          })

      })
      .catch(err => {
        console.error(err);
      })

  }


}
