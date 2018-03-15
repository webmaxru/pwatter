import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { environment } from './../environments/environment';

@Injectable()
export class ConfigService {

    private configUrl = environment.production ? './assets/config/config.prod.json' : './assets/config/config.dev.json';

    private _config: any;

    constructor(private httpClient: HttpClient) {
    }

    load(): Promise<any> {

        let promise: Promise<any> = new Promise((resolve: any) => {

            this.callApi(this.configUrl)
                .subscribe(config => {
                    this._config = config;
                    resolve(true)
                });
        });
        return promise;
    }

    getConfig(key: any) {
        return this._config[key];
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            let body = {}
            try {
                body = error.json();
            } catch (e) {
            }
            const err = body['error'] || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);

        return Observable.throw(errMsg);
    }

    callApi(url: string): Observable<any> {

        return this.httpClient
            .get(url)
            .catch(this.handleError);
    }
}