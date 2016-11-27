"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GITHUB_TOKEN = "f28435cfc0d491276c66b6509818317912adc143";
var ENTER_KEY = 13,
    ARROW_UP_KEY = 38,
    ARROW_DOWN_KEY = 40;

var InputAutocomplete = function () {
  function InputAutocomplete(input) {
    var _this = this;

    _classCallCheck(this, InputAutocomplete);

    var MAIN_CLASS = "c-input-autocomplete";

    if (input.classList.contains(MAIN_CLASS + "__input")) return false;else input.classList.add(MAIN_CLASS + "__input");

    var WRAPPER = document.createElement('div');
    WRAPPER.className = MAIN_CLASS;
    input.parentNode.insertBefore(WRAPPER, input);

    var ICON = document.createElement('img');
    ICON.className = MAIN_CLASS + "__icon";
    ICON.src = "img/search.svg";
    ICON.draggable = false;
    ICON.onclick = function () {
      return input.focus();
    };
    WRAPPER.appendChild(ICON);

    WRAPPER.appendChild(input);

    var MENU_WRAPPER = document.createElement('div');
    MENU_WRAPPER.className = MAIN_CLASS + "__menu-wrapper";
    WRAPPER.appendChild(MENU_WRAPPER);

    var MENU = document.createElement('div');
    MENU.className = MAIN_CLASS + "__menu " + MAIN_CLASS + "__menu--hidden";
    MENU_WRAPPER.appendChild(MENU);

    _extends(this, { input: input, menu: MENU, fetchId: null, oldValue: "" });

    input.addEventListener('keyup', function (event) {
      return _this.onQueryChange(event);
    });
    input.addEventListener('keydown', function (event) {
      return _this.onMenuControl(event);
    });
    input.addEventListener('focus', function () {
      return _this.showMenu();
    });

    MENU.addEventListener('mousemove', function (event) {
      return _this.highlightItem(_this.getParentItem(event.target));
    });
  }

  _createClass(InputAutocomplete, [{
    key: "onQueryChange",
    value: function onQueryChange() {
      var _this2 = this;

      var API_URL = "https://api.github.com/search/users";
      var QUERY = this.input.value.trim();

      if (QUERY === "") {
        this.hideMenu();
        return false;
      }
      if (this.oldValue === QUERY) {
        return false;
      }

      this.fetchFrom(API_URL + "?q=" + QUERY + "&access_token=" + GITHUB_TOKEN, function (response) {
        return _this2.renderMenu(response, QUERY);
      });
    }
  }, {
    key: "onMenuControl",
    value: function onMenuControl(event) {
      var KEY = event.which || event.keyCode;

      if (KEY === ENTER_KEY) {
        event.preventDefault();
        this.input.blur();
        this.hideMenu();
        window.open(this.getHighlightedItem().href, '_blank');
      } else if (KEY === ARROW_DOWN_KEY || KEY === ARROW_UP_KEY) {
        event.preventDefault();
        var ITEMS = this.menu.querySelectorAll('.c-input-autocomplete__item');
        var HIGHLIGHTED = this.getHighlightedItem();

        var index = Array.from(ITEMS).indexOf(HIGHLIGHTED);

        if (KEY == ARROW_DOWN_KEY) index++;else if (KEY == ARROW_UP_KEY) index--;

        this.highlightItem(ITEMS[index]);
      }
    }
  }, {
    key: "fetchFrom",
    value: function fetchFrom(url, callback) {
      var _this3 = this;

      var FETCH_ID = Symbol();
      this.fetchId = FETCH_ID;

      window.fetch(url).then(function (response) {
        if (response.ok) return response.json();else console.log('Network response was not ok.');
      }).then(function (response_obj) {
        if (FETCH_ID === _this3.fetchId) callback(response_obj);
      }).catch(function (error) {
        return console.log(error.stack);
      });
    }
  }, {
    key: "showMenu",
    value: function showMenu() {
      if (this.input.value.trim() !== "") this.menu.classList.remove('c-input-autocomplete__menu--hidden');
    }
  }, {
    key: "hideMenu",
    value: function hideMenu() {
      this.menu.classList.add('c-input-autocomplete__menu--hidden');
    }
  }, {
    key: "renderMenu",
    value: function renderMenu(response, query) {
      var _this4 = this;

      var ITEMS = this.createItems(response, query);
      this.menu.innerHTML = "";

      var TITLE = document.createElement('div');
      TITLE.className = "c-input-autocomplete__menu-title";
      TITLE.innerText = this.getTitle(ITEMS.length);
      this.menu.appendChild(TITLE);

      ITEMS.map(function (item, index) {
        if (index === 0) {
          item.classList.add('c-input-autocomplete__item--highlight');
        }
        _this4.menu.appendChild(item);
      });

      this.showMenu();
      this.oldValue = query;
    }
  }, {
    key: "createItems",
    value: function createItems(response, query) {
      var _this5 = this;

      return response.items.slice(0, 5).map(function (item) {
        var WRAPPER = document.createElement('a');
        WRAPPER.className = "c-input-autocomplete__item";
        WRAPPER.href = item.html_url;
        WRAPPER.target = "_blank";
        WRAPPER.onclick = function () {
          return _this5.hideMenu();
        };

        var AVATAR = document.createElement('img');
        AVATAR.className = "c-input-autocomplete__avatar";
        AVATAR.src = item.avatar_url;
        AVATAR.draggable = false;
        WRAPPER.appendChild(AVATAR);

        var NAME = document.createElement('div');
        NAME.className = "c-input-autocomplete__username";
        NAME.innerHTML = item.login.replace(new RegExp("(" + query + ")", 'ig'), '<b>$1</b>');
        WRAPPER.appendChild(NAME);

        return WRAPPER;
      });
    }
  }, {
    key: "highlightItem",
    value: function highlightItem(item) {
      if (item) {
        this.getHighlightedItem().classList.remove('c-input-autocomplete__item--highlight');
        item.classList.add('c-input-autocomplete__item--highlight');
      }
    }
  }, {
    key: "getHighlightedItem",
    value: function getHighlightedItem() {
      return this.menu.querySelector('.c-input-autocomplete__item--highlight');
    }
  }, {
    key: "getParentItem",
    value: function getParentItem(element) {
      while (!element.classList.contains('c-input-autocomplete__item') && !element.classList.contains('c-input-autocomplete')) {
        element = element.parentNode;
      }
      return element.classList.contains('c-input-autocomplete') ? null : element;
    }
  }, {
    key: "getTitle",
    value: function getTitle(items_length) {
      return !items_length ? "NO RESULTS" : "GITHUB USER" + (items_length > 1 ? "S" : "");
    }
  }]);

  return InputAutocomplete;
}();