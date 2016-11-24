"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
var g_github_user_results_limit = 5;

var InputAutocomplete = function () {
  function InputAutocomplete(input) {
    var _this = this;

    _classCallCheck(this, InputAutocomplete);

    var main_class = "c-input-autocomplete";

    if (input.classList.contains(main_class + "__input")) {
      return false;
    } else {
      input.classList.add(main_class + "__input");
    }

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
    container.className = main_class + "__menu " + main_class + "__menu--hidden";

    _extends(this, { input: input, menu: menu, request: null, oldValue: "" });

    input.addEventListener('keyup', function () {
      return _this.onkeyup();
    });
    input.addEventListener('keydown', function () {
      return _this.onkeydown();
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

      if (query === "") {
        this.hideMenu();
        return false;
      }
      if (inst.oldValue === query) {
        return false;
      }
      if (this.request) {
        this.request.abort();
      }

      var request = fetch(api_url + "?q=" + query + "&access_token=" + g_github_token).then(function (response) {
        if (response.ok) {
          _this2.renderMenu(response.json(), query);
        } else {
          console.log('Network response was not ok.');
        }
      }).catch(function (error) {
        console.log("There has been a problem with your fetch operation:\n          " + error.message);
      });
    }
  }, {
    key: "onkeydown",
    value: function onkeydown(event) {
      var key = event.which || event.keyCode;

      if (key === 13) {
        // enter
        event.preventDefault();
        input.blur();
        this.hideMenu();
        window.open(this.getHighlightedItem().href, '_blank');
      } else if (key === 40 || key === 38) {
        // down or up
        event.preventDefault();

        var items = this.menu.querySelectorAll('.c-auto-complete-ajax__item');
        var item_highlighted = this.get_highlighted_item();

        if (item_highlighted === null) {
          console.log("No anchor were highlighted.");
          return false;
        }

        var index = null;

        for (var i = 0; i < items.length; i++) {
          if (items[i] === item_highlighted) {
            index = i;
          }
        }

        if (key == 40) // down
          {
            index++;
          }

        if (key == 38) // up
          {
            index--;
          }

        if (items[index]) {
          this.highlight_item(items[index]);
        }
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

      var items = p.createItems(query, response);
      this.menu.innerHTML = "";

      var title = document.createElement('div');
      title.className = "c-auto-complete-ajax__title";
      title.innerText = this.getTitle(items.length);
      this.container.appendChild(title);

      items.map(function (item, index) {
        if (index === 0) {
          _this3.highlightItem(item);
        }
        _this3.menu.appendChild(item);
      });

      this.showMenu();
      this.oldValue = query;
    }
  }, {
    key: "getTitle",
    value: function getTitle(items_length) {
      return !items_length ? "NO RESULTS" : "GITHUB USER" + (items_length > 1 ? "S" : "");
    }
  }, {
    key: "createItems",
    value: function createItems(response, query) {
      return response.items.slice(0, g_github_user_results_limit).map(function (item) {
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
      });
    }
  }]);

  return InputAutocomplete;
}();