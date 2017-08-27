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
  }

  subscribeToUpdates() {


  }


}
