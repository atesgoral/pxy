# pxy

Pxy (pronounced "pixie") proxies promises. It wraps a new promise (the proxy promise) around an existing promise (the original promise) and relays the resolution, rejection or notification of the original promise to the proxy promise.

![Valid](/../gh-pages/assets/pxy_valid.png?raw=true "Valid")

The relaying of updates to all promises that are proxied by a Pxy instance are prevented when the Pxy instance is invalidated. 

![Invalidated](/../gh-pages/assets/pxy_invalidated.png?raw=true "Invalidated")

Moreover, the Pxy instance can be told to recognize promises that are originating from different asynchronous operations (e.g. an HTTP fetch, a timeout, an audio playback, etc.) and cancel those pending operations when the instance is invalidated.

## Installation

Via Bower:

```sh
bower install pxy
```

Via NPM:

```sh
npm install pxy
```

## Usage

You can grab the Pxy constructor via an AMD or CommonJS `require()`. In the absence of a module loader environment, it's made available globally as `Pxy`.

Create a new instance for every context/scope where you need to control the notification flow and lifetime of promises. Pass in a [Q](https://github.com/kriskowal/q)-compatible promise factory as the first argument. Angular's [$q](https://docs.angularjs.org/api/ng/service/$q) works. There is currently no support for jQuery's [Deferred](http://api.jquery.com/category/deferred-object/):

```js
var pxy = new Pxy(Q);
```

Find instances where you have a promise returned as a result of an asynchronous operation:

```js
var fetch = http.get(...),
    timer = timeout(...);
    
fetch.then(...);
timer.then(...);
```

Wrap these promises inside Pxy proxies. Since the proxies are promises themselves, the rest of your code doesn't have to change:

```js
var fetch = pxy.proxy(http.get(...)),
    timer = pxy.proxy(timeout(...));

fetch.then(...);
timer.then(...);
```
