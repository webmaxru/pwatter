import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { WindowRef } from './window-ref';


declare const BroadcastChannel;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PWAtter';

  constructor(public refreshSnackBar: MdSnackBar, private winRef: WindowRef) { }

  ngOnInit() {

    const updateChannel = new BroadcastChannel('pwatter-channel');
    updateChannel.addEventListener('message', event => {

      console.log(`Cache updated: ${event.data.payload.updatedUrl}`);

      let refreshSnackBarRef = this.refreshSnackBar.open('Newer version of the app is available', 'Refresh');

      refreshSnackBarRef.onAction().subscribe(() => {
        this.winRef.nativeWindow.location.reload()
      });

    });

  }


}
