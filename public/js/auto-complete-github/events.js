"use strict";

auto_complete_ajax.prototype.input_onkeyup = function () {
    var inst = this;
    var input = inst.input;
    var query = input.value.trim();
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

            if (xhr.status == 200) // Success
                {
                    inst.http_request_success(xhr.responseText);
                    inst.old_value = query;
                }
        }
    };

    xhr.error = inst.http_request_error;

    xhr.open("GET", "https://api.github.com/search/users?q=" + query + "&access_token=" + g_github_token, true);

    xhr.send();
};

auto_complete_ajax.prototype.input_onkeydown = function (e) {
    if ((e.which || e.keyCode) == 13) // enter
        {
            e.preventDefault();
            this.window_open_user_profile(e);
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
    this.highlight_item(this.closest_anchor(e.target));
};

auto_complete_ajax.prototype.container_onclick = function () {
    this.hide_menu();
};