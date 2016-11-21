'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var is_object = function is_object(variable) {
    return variable !== null && (typeof variable === 'undefined' ? 'undefined' : _typeof(variable)) === 'object';
};

var deep_extend = function deep_extend(out) {
    // USAGE:
    // var new_obj = deep_extend({}, obj1, obj2);

    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];

        if (!obj) {
            continue;
        }

        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                out[k] = is_object(obj[k]) ? deep_extend(out[k], obj[k]) : obj[k];
            }
        }
    }
    return out;
};