# Pxy

Pxy (pronounced "pixie") proxies promises. It wraps a new promise (the proxy promise) around an existing promise (the original promise) and relays the fulfillment, rejection or notification of the original promise to the proxy promise.

![Valid](/../gh-pages/assets/pxy_valid.png?raw=true "Valid")

The relaying of state transitions of all promises that are proxied by a Pxy instance are prevented when the Pxy instance is invalidated. 

![Invalidated](/../gh-pages/assets/pxy_invalidated.png?raw=true "Invalidated")

Moreover, the Pxy instance can be told how to recognize different types of promises that are originating from different asynchronous operations (e.g. an HTTP fetch, a timeout, an audio playback, etc.) and cancel those pending operations when the instance is invalidated.

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

Create a new instance for every scope where you need control over the state transition notification flow and lifetime of promises. Here, a "scope" means any scope/state/context that has a temporary lifetime within the flow of your application. This can be a DOM fragment for a rendered subview, an Angular scope for a route that's being visited, or some proprietary construct you've come up with.

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

This will stop the propagation of state transitions of original promises to their proxies, and hence the state transition handlers in your code; allowing your code not to care about the outcome of asynchronous operations after the scope in which they were initiated has been abandoned.

A common use case is promises for pending HTTP fetches on single page web applications. There is usually no observable harm when an HTTP fetch completes after the relevant view has been long abandoned. Typically, the success/failure handlers for fetch promises update view models that are bound to the DOM or directly update the DOM. But since the view has been abandoned, nothing that's visible happens when detached DOM fragments or orphan view models are updated. Though, in some cases there can be JavaScript runtime errors being silently logged in the console. This is entirely prevented with proxies that prevent the success/failure handlers from being fired.

Moreover, Pxy can automatically cancel pending HTTP fetches for you, if a cancellation recipe is provided to it during instantiation (see below). This has the added benefit of reducing bandwidth usage and load on the backend server.

Another common use case is timeout/interval timers that need to be canceled when the relevant view is abandoned. You would typically need to keep track of scope/DOM destruction or route changes yourself and explicitly cancel any pending timers. Pxy handles this automatically for you; first by preventing timer handlers from being fired and secondly by cancelling the timers if Pxy is told how to cancel them.

To give Pxy a promise cancellation recipe, pass a promise canceller function as the second argument to the constructor:

```js
var pxy = new Pxy(Q, function (promise) {
    // Detect type of promise and cancel it if it's cancellable
});
```

When the Pxy instance is invalidated, the canceler will be called with all the pending promises that the Pxy instance is tracking. Note that any fulfilled or rejected promise is immediately removed from the pxy instance and therefore won't be passed to the canceler.

## Angular-specific

You can directly use the `$q` service in the constructor. You can also use the following recipe for automatically cancelling Angular timeout and intervals:

```js
var pxy = new Pxy($q, function (promise) {
    if (promise.$$timeoutId) {
        $timeout.cancel(promise);
    } else if (promise.$$intervalId) {
        $interval.cancel(promise);
    }
});
```

You can create a new Pxy instance for each view scope, proxy all promises that are initiated within that scope, and then invalidate the Pxy instance when the scope is destroyed:

```js
var pxy = new Pxy($q, promiseCanceler);

var fetch = pxy.proxy($http.get(...));

$scope.$on('$destroy', pxy.invalidate);
```

Also see [angular-pxy](https://myplanet.github.io/angular-pxy) that automatically creates and invalidates Pxy instances for Angular scopes.
