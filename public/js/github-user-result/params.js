"use strict";

var g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
var g_res_limit = 5;

// "https://api.github.com/search/users?q=" + query + "&access_token=" + g_github_token

auto_complete_ajax.prototype.http_request_success = function (response) {
    var p = this.params;
    var query = p.input.value.trim();

    if (/^\s*[\[\{].*[\]\}]\s*$/.test(response)) {
        response = JSON.parse(response);
    }

    p.wrapper.innerHTML = "";

    if (!response.items) {
        return false;
    }

    var nb = response.items.length < g_res_limit ? response.items.length : g_res_limit;

    // title goes on top of the results
    var title = document.createElement('div');
    title.className = "auto-complete-ajax__list-title";
    title.innerText = !nb ? "NO RESULTS" : "GITHUB USER" + (nb > 1 ? "S" : "");

    p.wrapper.appendChild(title);

    for (var i = 0; i < nb; i++) {
        var items = this.create_item_anchor(query, response.items[i]);

        if (i === 0) // highlight first result
            {
                this.highlight_item(items);
            }

        p.wrapper.appendChild(items);
    }

    this.show_menu();
    this.old_value = query;
};

auto_complete_ajax.prototype.http_request_error = function () {
    alert('An error occured while getting the users from Github.');
};

auto_complete_ajax.prototype.create_item_anchor = function (query, ajax_data) {
    var item = document.createElement('a');
    item.className = "auto-complete-ajax__list-item";
    item.href = ajax_data.html_url;
    item.target = "_blank";

    var avatar = document.createElement('img');
    avatar.className = "auto-complete-ajax__list-avatar";
    avatar.src = ajax_data.avatar_url;
    avatar.draggable = false;

    var name = document.createElement('div');
    var name_class = "auto-complete-ajax__list-username";
    name.className = name_class;

    name.innerHTML = ajax_data.login.replace(new RegExp("(" + query + ")", "i"), '<b class="' + name_class + '-b">$1</b>');

    item.appendChild(avatar);
    item.appendChild(name);

    return item;
};

auto_complete_ajax.prototype.window_open_user_profile = function (e) {
    var input = this.input;

    // prevent the menu to reappear when the focus is back on the tab
    input.blur();
    this.hide_menu();

    // open github user's profile in a new tab
    window.open(this.get_highlighted_item().href, '_blank');
};