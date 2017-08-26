import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ConfigService } from './../config.service';

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


  constructor(public sw: NgServiceWorker, private configService: ConfigService, public snackBar: MdSnackBar) {
  }

  ngOnInit() {

    this.API_URL = this.configService.get('API_URL')
    
    this.sw.log().subscribe(message => console.log(message));

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    this.convertedVapidKey = urlBase64ToUint8Array(this.vapidPublicKey);
    
  }

  subscribeToPush() {

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .subscribe({ userVisibleOnly: true, applicationServerKey: this.convertedVapidKey })
          .then(subscription => {

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
                  duration: 2000
                });
              })
              .catch(error => {
                console.log('[App] Subscription request failed', error)
              });
          });

      })
      .catch(error => {
        console.log(error);
      })

  }

  unsubscribeFromPush() {

    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .getSubscription()
          .then(subscription => {

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
                      duration: 2000
                    });
                  })
                  .catch(error => {
                    console.log('[App] Unsubscription failed', error)
                  })

              })
              .catch(error => {
                console.log('[App] Unsubscription request failed', error)
              });

          })

      })
      .catch(error => {
        console.log(error);
      })

  }


  pingCompanion(): void {

    this
      .sw
      .ping()
      .subscribe(undefined, undefined, () => {
        console.log('pong');
      });

  }

  registerForPush(): void {

    this
      .sw
      .registerForPush({ applicationServerKey: this.vapidPublicKey })
      .subscribe(handler => {
        console.log(JSON.stringify({
          url: handler.url,
          key: handler.key(),
          auth: handler.auth()
        }));
      });

    this
      .sw
      .push
      .map(value => JSON.stringify(value))
      .subscribe(value => {
        console.log('[App] Push message arrived', value)
      });

  }


}
