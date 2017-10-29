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

  constructor(private winRef: WindowRef) {
  }

  ngOnInit() {
  }

  openLog() {

    this.winRef.nativeWindow.open('/ngsw/state')

  }

}
