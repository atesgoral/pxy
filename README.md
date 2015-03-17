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

Create a new instance for every scope where you need to control the notification flow and lifetime of promises. Here, a "scope" means any scope/state/context that has a temporary lifetime within the flow of your application. This can be a DOM fragment for a rendered subview, an Angular scope for a route that's being visited, or some proprietary construct you've come up with.

Pass in a [Q](https://github.com/kriskowal/q)-compatible promise factory as the first argument. Angular's [$q](https://docs.angularjs.org/api/ng/service/$q) works. There is currently no support for jQuery's [Deferred](http://api.jquery.com/category/deferred-object/):

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

When the current scope is about to be left or destroyed, invalidate the Pxy instance:

```js
pxy.invalidate();
```

This will stop the propagation of state changes on original promises to their proxies, and hence the state change handlers in your code. This will allow your code not to care about the outcome of asynchronous operations after the scope in which they were initiated has been abandoned.

A common use case is promises for pending HTTP fetches on single page web applications. There is usually no observable harm when an HTTP fetch completes after the relevant view has been long abandoned. Typically, the success/failure handlers for fetch promises update view models that are bound to the DOM or directly update the DOM. But since the view has been abandoned, nothing that's visible happens when detached DOM fragments or orphan view models are updated. Though, in some cases there can be JavaScript runtime errors being silently logged in the console. This is entirely prevented with proxies that prevent the success/failure handlers from being fired.

Moreover, Pxy can automatically cancel pending HTTP fetches for you, if a cancellation recipe is provided to it during instantiation (see below). This has the added benefit of reducing bandwidth usage and load on the backend server.

Another common use case is timeout/interval timers that need to be canceled when the relevant view is abandoned. You would typically need to keep track of scope/DOM destruction or route changes yourself and explicitly cancel any pending timers. Pxy handles this automatically for you; first by preventing timer handlers from being fired and secondly by cancelling the timers if Pxy is told how to cancel them.
