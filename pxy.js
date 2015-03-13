(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'exports' ], function (exports) {
            factory((root.Pxy = exports));
        });
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory((root.Pxy = {}));
    }
}(this, function (exports) {
    function Pxy(Q) {
        var originalPromises = [],
            isValid = true;

        this.invalidate = function (cancel) {
            isValid = false;
            originalPromises.forEach(cancel);
        };

        this.proxy = function (promise) {
            originalPromises.push(promise);

            var proxy = Q.defer();

            promise.then(function () {
                originalPromises.splice(originalPromises.indexOf(promise), 1);

                if (isValid) {
                    proxy.resolve.apply(proxy, arguments);
                }
            }, function () {
                originalPromises.splice(originalPromises.indexOf(promise), 1);

                if (isValid) {
                    proxy.reject.apply(proxy, arguments);
                }
            }, function () {
                if (isValid) {
                    proxy.notify.apply(proxy, arguments);
                }
            });

            return proxy.promise;
        };
    }

    return Pxy;
}));
