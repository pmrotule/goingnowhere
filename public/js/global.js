"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var add_class = function add_class(element, class_name) {
    // regex to check if the element already has the class
    var regex = new RegExp("(\\s|^)" + class_name + "(\\s|$)", "g");
    if (regex.test(element.className)) {
        return true;
    }

    if (element.className != "") {
        element.className += " ";
    }

    element.className += class_name;
};

var remove_class = function remove_class(element, class_name) {
    // regex to get the class
    var regex = new RegExp("(\\s|^)" + class_name + "(\\s|$)", "g");
    element.className.replace(regex, " ").trim();
};

var is_object = function is_object(variable) {
    return variable !== null && (typeof variable === "undefined" ? "undefined" : _typeof(variable)) === 'object';
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