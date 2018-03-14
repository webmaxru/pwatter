import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { WindowRef } from './../window-ref';

declare const BroadcastChannel;

@Component({
  selector: 'app-control-broadcast',
  templateUrl: './control-broadcast.component.html',
  styleUrls: ['./control-broadcast.component.css']
})
export class ControlBroadcastComponent implements OnInit {

  constructor(public snackBar: MatSnackBar, private winRef: WindowRef) { }

  ngOnInit() {

    this.subscribeToUpdates()

  }

  subscribeToUpdates() {

    const updateChannel = new BroadcastChannel('pwatter-channel');

    updateChannel.addEventListener('message', event => {

      console.log(`[App] Cache updated: ${event.data.payload.updatedUrl}`);

      let snackBarRef = this.snackBar.open('Newer version of the app is available', 'Refresh');

      snackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload()
      });

    });

  }


}
