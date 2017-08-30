# Progressive Web App with Angular 5 beta 5 + [Workbox 2.0](https://www.workboxjs.org/)

Read [Using Workbox 2 and Angular 5 to create a Progressive Web App. Part 1: App shell](https://medium.com/@webmaxru/using-workbox-2-and-angular-5-to-create-a-progressive-web-app-part-1-app-shell-b14f9872384a) article for the details.

<img src="https://raw.githubusercontent.com/webmaxru/pwatter/master/src/assets/images/logo.png" width="200" height="200">

[DEMO](https://pwa-workshop-angular.firebaseapp.com/)

[Backend used for the demo](https://github.com/webmaxru/pwa-workshop-api/)

Questions? [@webmaxru](https://twitter.com/webmaxru/)

To get started, install Angular CLI from [npm](https://www.npmjs.com/).

```
$ npm install -g @angular/cli
```

Then install dependencies and types:

```
$ npm install
```

Then build the app:

```
$ npm run build-full-workbox
```

And serve the `dist` folder using any static webserver.

## Some of features

### Push notifications

![Push notifications](https://raw.githubusercontent.com/webmaxru/pwatter/master/src/assets/images/push.gif "Push notifications")

### Replay offline requests

![Background sync](https://raw.githubusercontent.com/webmaxru/pwatter/master/src/assets/images/sync.gif "Background sync")

### Subscribe to updates

![Broadcast channel](https://raw.githubusercontent.com/webmaxru/pwatter/master/src/assets/images/broadcast.gif "Broadcast channel")