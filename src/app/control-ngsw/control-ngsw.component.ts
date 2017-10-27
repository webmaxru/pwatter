import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { WindowRef } from './../window-ref';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/take';

import { ConfigService } from './../config.service';
import { PushService } from './../push.service';

@Component({
  selector: 'app-control-ngsw',
  templateUrl: './control-ngsw.component.html',
  styleUrls: ['./control-ngsw.component.css']
})
export class ControlNgswComponent implements OnInit {

  private snackBarDuration: number = 2000;
  private VAPID_PUBLIC_KEY: string;

  constructor(private pushService: PushService, public snackBar: MatSnackBar, private configService: ConfigService, private swPush: SwPush, private winRef: WindowRef) {

  }

  ngOnInit() {

    this.VAPID_PUBLIC_KEY = this.configService.get('VAPID_PUBLIC_KEY')

  }

  checkForUpdate() {

  }

  activateUpdate() {

  }

  subscribeToPush() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
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


        // Delete the subscription on the backend
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

        console.log(message)

      })
  }


  openLog() {

  }

}
