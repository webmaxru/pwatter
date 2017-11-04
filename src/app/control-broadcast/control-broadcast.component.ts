import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { WindowRef } from './../window-ref';

import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-control-broadcast',
  templateUrl: './control-broadcast.component.html',
  styleUrls: ['./control-broadcast.component.css']
})
export class ControlBroadcastComponent implements OnInit {

  constructor(private swUpdate: SwUpdate, public snackBar: MatSnackBar, private winRef: WindowRef) { }

  ngOnInit() {

    this.swUpdate.available.subscribe(event => {

      console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
      let snackBarRef = this.snackBar.open('Newer version of the app is available', 'Refresh');

      snackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload()
      });

    });

    this.swUpdate.activated.subscribe(event => {
      console.log('[App] Update activated: old version was', event.previous, 'new version is', event.current);
    });

  }

  checkForUpdate() {
    console.log('[App] checkForUpdate started')
    this.swUpdate.checkForUpdate()
      .then(() => {
        console.log('[App] checkForUpdate completed')
      })
      .catch(err => {
        console.error(err);
      })
  }

  activateUpdate() {
    console.log('[App] activateUpdate started')
    this.swUpdate.activateUpdate()
      .then(() => {
        console.log('[App] activateUpdate completed')
        this.winRef.nativeWindow.location.reload()
      })
      .catch(err => {
        console.error(err);
      })
  }


}
