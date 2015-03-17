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

Create a new instance for every context/scope where you need to control the notification flow and lifetimes of promises. Pass in a [Q](https://github.com/kriskowal/q)-compatible promise factory as the first argument. Angular's [$q](https://docs.angularjs.org/api/ng/service/$q) works. There is currently no support for jQuery's [Deferred](http://api.jquery.com/category/deferred-object/):

```js
var pxy = new Pxy(Q);
```

