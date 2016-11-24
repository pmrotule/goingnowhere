"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var g_github_token = "f28435cfc0d491276c66b6509818317912adc143";

var InputAutocomplete = function () {
  function InputAutocomplete(input) {
    var _this = this;

    _classCallCheck(this, InputAutocomplete);

    var main_class = "c-input-autocomplete";

    if (input.classList.contains(main_class + "__input")) return false;else input.classList.add(main_class + "__input");

    var wrapper = document.createElement('div');
    wrapper.className = main_class;
    input.parentNode.insertBefore(wrapper, input);

    var icon = document.createElement('img');
    icon.className = main_class + "__icon";
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = function () {
      input.focus();
    };
    wrapper.appendChild(icon);

    wrapper.appendChild(input);

    var menu_wrapper = document.createElement('div');
    menu_wrapper.className = main_class + "__menu-wrapper";
    wrapper.appendChild(menu_wrapper);

    var menu = document.createElement('div');
    menu.className = main_class + "__menu " + main_class + "__menu--hidden";
    menu_wrapper.appendChild(menu);

    _extends(this, { input: input, menu: menu, fetchId: null, oldValue: "" });

    input.addEventListener('keyup', function (event) {
      return _this.onkeyup(event);
    });
    input.addEventListener('keydown', function (event) {
      return _this.onkeydown(event);
    });
    input.addEventListener('focus', function () {
      return _this.showMenu();
    });

    menu.addEventListener('click', function () {
      return _this.hideMenu();
    });
    menu.addEventListener('mousemove', function (event) {
      return _this.highlightItem(_this.getParentItem(event.target));
    });
  }

  _createClass(InputAutocomplete, [{
    key: "onkeyup",
    value: function onkeyup() {
      var _this2 = this;

      var api_url = "https://api.github.com/search/users";
      var query = this.input.value.trim();
      var fetchId = Symbol();
      this.fetchId = fetchId;

      if (query === "") {
        this.hideMenu();
        return false;
      }
      if (this.oldValue === query) {
        return false;
      }

      window.fetch(api_url + "?q=" + query + "&access_token=" + g_github_token).then(function (response) {
        if (response.ok) return response.json();else console.log('Network response was not ok.');
      }).then(function (response_obj) {
        if (fetchId === _this2.fetchId) _this2.renderMenu(response_obj, query);
      }).catch(function (error) {
        return console.dir(error);
      });
    }
  }, {
    key: "onkeydown",
    value: function onkeydown(event) {
      var key = event.which || event.keyCode;

      if (key === 13) {
        // enter
        event.preventDefault();
        this.input.blur();
        this.hideMenu();
        window.open(this.getHighlightedItem().href, '_blank');
      } else if (key === 40 || key === 38) {
        // down or up
        event.preventDefault();
        var items = this.menu.querySelectorAll('.c-input-autocomplete__item');
        var highlighted = this.getHighlightedItem();

        var index = Array.from(items).indexOf(highlighted);

        if (key == 40) // down
          index++;else if (key == 38) // up
          index--;

        this.highlightItem(items[index]);
      }
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
      var _this3 = this;

      var items = this.createItems(response, query);
      this.menu.innerHTML = "";

      var title = document.createElement('div');
      title.className = "c-input-autocomplete__menu-title";
      title.innerText = this.getTitle(items.length);
      this.menu.appendChild(title);

      items.map(function (item, index) {
        if (index === 0) {
          item.classList.add('c-input-autocomplete__item--highlight');
        }
        _this3.menu.appendChild(item);
      });

      this.showMenu();
      this.oldValue = query;
    }
  }, {
    key: "createItems",
    value: function createItems(response, query) {
      return response.items.slice(0, 5).map(function (item) {
        var wrapper = document.createElement('a');
        wrapper.className = "c-input-autocomplete__item";
        wrapper.href = item.html_url;
        wrapper.target = "_blank";

        var avatar = document.createElement('img');
        avatar.className = "c-input-autocomplete__avatar";
        avatar.src = item.avatar_url;
        avatar.draggable = false;
        wrapper.appendChild(avatar);

        var name = document.createElement('div');
        name.className = "c-input-autocomplete__username";
        name.innerHTML = item.login.replace(new RegExp("(" + query + ")", 'ig'), '<b>$1</b>');
        wrapper.appendChild(name);

        return wrapper;
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