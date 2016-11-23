'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputAutocomplete = function InputAutocomplete(input) {
    var _this = this;

    _classCallCheck(this, InputAutocomplete);

    var main_class = "c-input-autocomplete";

    if (input.classList.contains(main_class + '__input')) {
        return false;
    } else {
        input.classList.add(main_class + '__input');
    }

    var wrapper = document.createElement('div');
    wrapper.className = main_class;
    input.parentNode.insertBefore(wrapper, input);

    var icon = document.createElement('img');
    icon.className = main_class + '__icon';
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = function () {
        input.focus();
    };
    wrapper.appendChild(icon);

    wrapper.appendChild(input);

    var menu_wrapper = document.createElement('div');
    menu_wrapper.className = main_class + '__menu-wrapper';
    wrapper.appendChild(menu_wrapper);

    var menu = document.createElement('div');
    container.className = main_class + '__menu ' + main_class + '__menu--hidden';

    _extends(this, { input: input, menu: menu, xhr: null, oldValue: "" });

    input.addEventListener('keyup', function () {
        return _this.onkeyup();
    });
    input.addEventListener('keydown', function () {
        return _this.onkeydown();
    });
    input.addEventListener('focus', function () {
        return _this.onfocus();
    });

    menu.addEventListener('click', function () {
        return _this.hideMenu();
    });
    menu.addEventListener('mousemove', function (event) {
        return _this.highlightItem(_this.getParentItem(event.target));
    });
};