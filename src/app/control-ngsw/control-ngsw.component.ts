import { Component, OnInit } from '@angular/core';
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

  constructor(private pushService: PushService, public snackBar: MatSnackBar, private configService: ConfigService, private winRef: WindowRef) {

  }

  ngOnInit() {

  }

  checkForUpdate() {

  }

  activateUpdate() {

  }

  subscribeToPush() {

  }

  unsubscribeFromPush() {

  }

  showMessages() {

  }


  openLog() {

  }

}
