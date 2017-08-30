import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { WindowRef } from './../window-ref';

declare const BroadcastChannel;

@Component({
  selector: 'app-control-broadcast',
  templateUrl: './control-broadcast.component.html',
  styleUrls: ['./control-broadcast.component.css']
})
export class ControlBroadcastComponent implements OnInit {

  constructor(public refreshSnackBar: MdSnackBar, private winRef: WindowRef) { }

  ngOnInit() {
  }

  subscribeToUpdates() {

    const updateChannel = new BroadcastChannel('pwatter-channel');

    updateChannel.addEventListener('message', event => {

      console.log('[App] Cache updated', event.data.payload.updatedUrl);

      let refreshSnackBarRef = this.refreshSnackBar.open('Newer version of the app is available', 'Refresh');

      refreshSnackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload()
      });

    });

  }


}
