"use strict";

auto_complete_ajax.prototype.input_onkeyup = function () {
    var inst = this;
    var p = inst.params;
    var query = this.input.value.trim();
    var empty = query === "";

    if (empty) {
        inst.hide_menu();
    }

    if (inst.xhr) {
        inst.xhr.abort();
    }

    if (empty || inst.old_value === query) {
        return false;
    }

    var xhr = new XMLHttpRequest();
    inst.xhr = xhr;

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            inst.xhr = null;

            if (xhr.status == 200 && xhr.responseText && xhr.responseText !== "") {
                inst.ajax_success(xhr.responseText);
            }
        }
    };
    xhr.error = p.ajax_error;

    var url = typeof p.ajax_url === "function" ? p.ajax_url(query) : p.ajax_url;

    xhr.open("GET", url, true);
    xhr.send();
};

auto_complete_ajax.prototype.input_onkeydown = function (e) {
    if ((e.which || e.keyCode) == 13) // enter
        {
            e.preventDefault();
            this.params.onselect(this.get_highlighted_item(), "enter");

            this.hide_menu();
        } else {
        this.arrow_navigate(e);
    }
};

auto_complete_ajax.prototype.input_onfocus = function () {
    if (this.input.value.trim() !== "") {
        this.show_menu();
    }
};

auto_complete_ajax.prototype.container_onmousemove = function (e) {
    this.highlight_item(this.closest_item(e.target));
};

auto_complete_ajax.prototype.container_onclick = function () {
    this.hide_menu();
};