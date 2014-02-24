(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'exports' ], function (exports) {
            factory((root.pxy = exports));
        });
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory((root.pxy = {}));
    }
}(this, function (exports) {

}));
