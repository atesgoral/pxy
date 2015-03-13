# pxy

## Usage

```js
var pxy = new Pxy(Q); // Or your favorite Q-compatible promise implementation such as Angular's $q

//var fetch = $http.get(...); // without pxy
var fetch = pxy.proxy($http.get(...)); // with pxy

//var timeout = $timeout(...); // without pxy
var timeout = pxy.proxy($timeout(...)); // with pxy

fetch.then(function () {
    // ...
});

timeout.then(function () {
    // ...
});

// If we suddenly decide to ignore all promises that are pending:

pxy.invalidate();

