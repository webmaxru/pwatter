import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';

/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. As long as there is no update available, re-checks every 6 hours.
 * 3. As soon as an update is detected, it activates the update and notifies interested parties.
 * 4. It continues to check for available updates.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the version hash whenever an update is activated.
 */
@Injectable()
export class SwUpdatesService implements OnDestroy {
    private checkInterval = 1000 * 15;   // 6 hours 1000 * 60 * 60 * 6
    private onDestroy = new Subject();
    private checkForUpdateSubj = new Subject();
    updateActivated = this.sw.activated
        .takeUntil(this.onDestroy)
        .do(evt => this.log(`Update event: ${JSON.stringify(evt)}`))
        .map(evt => evt.current);

    constructor(private sw: SwUpdate) {
        this.log('Starting up...');
        this.checkForUpdateSubj
            .debounceTime(this.checkInterval)
            .startWith(null)
            .takeUntil(this.onDestroy)
            .subscribe(() => this.checkForUpdate());
        sw.available.subscribe(() => sw.activateUpdate());
    }

    ngOnDestroy() {
        this.onDestroy.next();
    }

    private checkForUpdate() {
        this.log('Checking for update...');
        this.sw.checkForUpdate().then(() => this.scheduleCheckForUpdate());
    }

    private log(message: string) {
        const timestamp = (new Date).toISOString();
        console.log(`[SwUpdates - ${timestamp}]: ${message}`);
    }

    private scheduleCheckForUpdate() {
        this.checkForUpdateSubj.next();
    }
}