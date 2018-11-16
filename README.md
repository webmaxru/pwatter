# A simple app for the PWA Workshop

## Prerequisites
1. Latest stable versions of `node`, `npm` installed.
2. Static web server with SPA support:
- [serve](https://www.npmjs.com/package/serve). Recommended and pre-configured.
- [superstatic](https://www.npmjs.com/package/superstatic). Use this as a fallback option.

## Installation

1. Clone the repo
```bash
git clone git@github.com:webmaxru/pwatter.git
```

2. Make sure you are on "workbox" branch:
```bash
git checkout workbox
```

3. Install dependencies:
```bash
npm install
```

4. Install "serve" dev webserver:
```bash 
npm install serve -g
```

5. Run the server inside "pwatter" directory:
```bash
serve
```

6. Install Workbox CLI:
```bash
npm install workbox-cli --global
```

7. Open the browser:
```bash
http://localhost:5000/ 
```
You should see the page with `PWAtter` header.

## We are ready to start the workshop! Follow the trainer instructions.

If for some reasons global npm package installation is not an option for you, you can install and run "serve" locally:
```bash
npm install serve
node_modules/.bin/serve
```
