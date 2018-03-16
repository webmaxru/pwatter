# A simple app for the PWA Workshop

## The workshop guide (open for your comments)
https://bit.ly/workbox-workshop

## Prerequisites
1. Latest stable versions of `node`, `npm` installed.
2. Having `yarn` installed is strongly recommended.
3. Any simple web server od browser extension. Recommended:
- [http-server](https://www.npmjs.com/package/http-server
). This is preferred option.
- [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/). Use this as a fallback option.


## Install
1. Clone the repo
2. 
```bash
yarn
```
or
```bash
npm install
```

## Install/update Angular CLI
```bash
npm uninstall -g angular-cli
npm uninstall -g @angular/cli
npm cache clean
npm install -g @angular/cli@latest
```

Check the version:
```bash
npm list @angular/cli version -g
```
The output should be at least `1.7.3`

## Checking the app
1. In the terminal
```bash
ng serve
```
2. Open [http://localhost:4200/](http://localhost:4200/). You should see the page with `PWAtter` header.
3. "Ctrl-C" to stop the app.

## Creating a production build and serving it via external web server
```bash
ng build --prod
```
The `dist` folder should be created.

- If you use `http-server`: Run `http-server dist -p 8080` and open `http://127.0.0.1:8080` in your browser.
- If you use `Web Server for Chrome`: Start `Web Server for Chrome` extension and point to this folder using "Choose folder" button OR. Open the link you see in "Web Server URL(s)" section (make sure the "Automatically show index.html" option is on).

You should see the page with `PWAtter` header.

## We are ready to start the workshop! Follow the trainer instructions.
