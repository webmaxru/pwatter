import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { WindowRef } from './../window-ref';

declare const BroadcastChannel;

import { NgServiceWorker } from '@angular/service-worker';

@Component({
  selector: 'app-control-broadcast',
  templateUrl: './control-broadcast.component.html',
  styleUrls: ['./control-broadcast.component.css']
})
export class ControlBroadcastComponent implements OnInit {

  constructor(public refreshSnackBar: MdSnackBar, private winRef: WindowRef, public sw: NgServiceWorker) { }

  ngOnInit() {
    this.sw.log().subscribe(message => console.log(message));
  }

  subscribeToUpdates() {

    const updateChannel = new BroadcastChannel('pwatter-channel');

    updateChannel.addEventListener('message', event => {

      console.log(`[App] Cache updated: ${event.data.payload.updatedUrl}`);

      let refreshSnackBarRef = this.refreshSnackBar.open('Newer version of the app is available', 'Refresh');

      refreshSnackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload()
      });

    });

  }

  subscribeToUpdatesNGSW(): void {

    this.sw.updates.subscribe(u => {

      console.log('[App] Update event', u);

      if (u.type == 'pending') {
        this.sw
          .activateUpdate(u.version)
          .subscribe(event => {

            console.log('[App] Cache updated', event);

            let refreshSnackBarRef = this.refreshSnackBar.open('Newer version of the app is available', 'Refresh');

            refreshSnackBarRef.onAction().subscribe(() => {
              this.winRef.nativeWindow.location.reload()
            });

          });
      }
    });

    this.sw.checkForUpdate();

  }


}
