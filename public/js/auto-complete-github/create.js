"use strict";

var g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
var g_res_limit = 5;

function auto_complete_github(input) {
    // check if the autocomplete has already been created
    if (/(\s|^)auto-complete-github__input(\s|$)/.test(input.className)) {
        return false;
    } else {
        if (input.className != "") {
            input.className += " ";
        }

        input.className += "auto-complete-github__input";
    }

    // create the main wrapper and insert it in the document
    var wrapper = document.createElement('div');
    wrapper.className = "auto-complete-github";
    input.parentNode.insertBefore(wrapper, input);

    // create the search icon and append it to the wrapper
    var icon = document.createElement('img');
    icon.className = "auto-complete-github__search-icon";
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = function () {
        input.focus();
    };
    wrapper.appendChild(icon);

    // append the input to the wrapper
    wrapper.appendChild(input);

    // create the menu
    var menu = document.createElement('div');
    menu.className = "auto-complete-github__menu";

    // create the results wrapper and append it to the menu
    var list = document.createElement('div');
    var list_className = "auto-complete-github__menu-list";
    list.className = list_className + " " + list_className + "--hidden";
    menu.appendChild(list);

    // append the menu to the wrapper
    wrapper.appendChild(menu);

    // create an object with relevant data and attach it to the input
    input.auto_complete_github = {
        list: list,
        xhr: null,
        old_value: ""
    };

    input.addEventListener('keyup', auto_complete_github.input_onkeyup);
    input.addEventListener('keydown', auto_complete_github.input_onkeydown);
    input.addEventListener('focus', auto_complete_github.input_onfocus);

    // better using mousemove than mouseover:
    // in case the user used the arrow keys to change the highlighted item between
    // two mouse movements over the same item
    list.addEventListener('mousemove', auto_complete_github.list_onmousemove);
    list.addEventListener('click', auto_complete_github.list_onclick);
}