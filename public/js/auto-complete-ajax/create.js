"use strict";

function auto_complete_ajax(params) {
    /* Mandatory parameters are marked with an asterisk
    params = {
        input* : inputElement,
        menu* : menuElement,
        ajax* : {
            url* : XMLHttpRequest url -> xhr.open("GET", url),
            success* : callback function on success,
            error : callback function on error
        }
     };
    */
    // check if the autocomplete has already been created
    if (/(\s|^)js-auto-complete-ajax-active(\s|$)/.test(input.className)) {
        return false;
    } else {
        if (input.className != "") {
            input.className += " ";
        }

        input.className += "js-auto-complete-ajax-active";
    }

    // create the results wrapper and append it to the menu
    var wrapper = document.createElement('div');
    var wrapper_class = "c-auto-complete-ajax";
    wrapper.className = wrapper_class + " " + wrapper_class + "--hidden";
    menu.appendChild(wrapper);

    // attach relevant data to the instance
    this.input = input;
    this.wrapper = wrapper;
    this.xhr = null;
    this.old_value = "";

    // .bind(this) to use "this" keyword as the instance instead of the input
    input.addEventListener('keyup', this.input_onkeyup.bind(this));
    input.addEventListener('keydown', this.input_onkeydown.bind(this));
    input.addEventListener('focus', this.input_onfocus.bind(this));

    // better using mousemove than mouseover:
    // in case the user used the arrow keys to change the highlighted item
    // between two mouse movements over the same item
    wrapper.addEventListener('mousemove', this.wrapper_onmousemove.bind(this));
    wrapper.addEventListener('click', this.wrapper_onclick.bind(this));
};