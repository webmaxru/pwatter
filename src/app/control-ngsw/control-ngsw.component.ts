import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { SwPush } from '@angular/service-worker';
import { WindowRef } from './../window-ref';
import { MatSnackBar } from '@angular/material';
import { SwUpdatesService } from '../sw-updates/sw-updates.service';

@Component({
  selector: 'app-control-ngsw',
  templateUrl: './control-ngsw.component.html',
  styleUrls: ['./control-ngsw.component.css']
})
export class ControlNgswComponent implements OnInit {

  private vapidPublicKey = 'BHe82datFpiOOT0k3D4pieGt1GU-xx8brPjBj0b22gvmwl-HLD1vBOP1AxlDKtwYUQiS9S-SDVGYe_TdZrYJLw8';

  constructor(public refreshSnackBar: MatSnackBar, private swUpdate: SwUpdate, private swPush: SwPush, private winRef: WindowRef, private swUpdates: SwUpdatesService) {

    console.log('[NGSW] ControlNgswComponent instantiated')

    swUpdate.available.subscribe(event => {

      console.log('current version is', event.current);
      console.log('available version is', event.available);

      let refreshSnackBarRef = this.refreshSnackBar.open('Newer version of the app is available', 'Refresh');

      refreshSnackBarRef.onAction().subscribe(() => {
        this.activateUpdate()
      });

    });
    
    swUpdate.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    swUpdates.updateActivated.subscribe(() => {
      console.log('[NGSW] updateActivated.subscribe')

    });

  }

  ngOnInit() {
  }

  checkForUpdate() {
    console.log('[NGSW] checkForUpdate started')
    this.swUpdate.checkForUpdate()
      .then(() => {
        console.log('[NGSW] checkForUpdate completed')
      })
      .catch(err => {
        console.error(err);
      })
  }

  activateUpdate() {
    console.log('[NGSW] activateUpdate started')
    this.swUpdate.activateUpdate()
      .then(() => {
        console.log('[NGSW] activateUpdate completed')
        this.winRef.nativeWindow.location.reload()
      })
      .catch(err => {
        console.error(err);
      })
  }

  subscribeToPush() {

    this.swPush.requestSubscription({
      serverPublicKey: this.vapidPublicKey
    })
      .then(subscription => {

        console.log(subscription)

      })
      .catch(err => {
        console.error(err);
      })

  }

  openLog() {

    this.winRef.nativeWindow.open('/ngsw/state')

  }

}
