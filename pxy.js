(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'module' ], function (module) {
            module.exports = factory();
        });
    } else if (typeof module === 'object') {
        module.exports = factory();
    } else {
        root.Pxy = factory();
    }
}(this, function () {
    function Pxy(Q, canceler) {
        var originalPromises = [],
            isValid = true;

        this.invalidate = function () {
            isValid = false;

            if (canceler) {
                originalPromises.forEach(canceler);
            }
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
