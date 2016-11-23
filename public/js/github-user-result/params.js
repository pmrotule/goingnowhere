"use strict";

var g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
var g_github_user_result_limit = 5;

// generate parameters for auto_complete_ajax()
function github_user_result(input, auto_complete_menu) {
    return {
        input: input,
        wrapper: auto_complete_menu,

        ajax_url: function ajax_url(query) {
            return "https://api.github.com/search/users?q=" + query + "&access_token=" + g_github_token;
        },

        ajax_error: function ajax_error() {
            alert('An error occured while getting the users from Github.');
        },

        menu_title: {
            no_results: "NO RESULTS",
            singular: "GITHUB USER",
            plural: "GITHUB USERS"
        },

        create_items: function create_items(query, ajax_response) {
            ajax_response = JSON.parse(ajax_response);
            var data = ajax_response.items;
            var items_returned = [];

            var count = data.length < g_github_user_result_limit ? data.length : g_github_user_result_limit;

            for (var i = 0; i < count; i++) {
                var item = document.createElement('a');
                item.className = "c-github-user-result";
                item.href = data[i].html_url;
                item.target = "_blank";

                var avatar = document.createElement('img');
                avatar.className = "c-github-user-result__avatar";
                avatar.src = data[i].avatar_url;
                avatar.draggable = false;

                var name = document.createElement('div');
                name.className = "c-github-user-result__username";
                name.innerHTML = data[i].login.replace(new RegExp("(" + query + ")", "i"), '<b>$1</b>');

                item.appendChild(avatar);
                item.appendChild(name);

                items_returned.push(item);
            }
            return items_returned;
        },

        items_limit: g_github_user_result_limit,

        onselect: function onselect(item_selected, context) {
            if (context === "enter") {
                // prevent the menu to reappear when the focus is back on the
                // tab
                input.blur();

                // open github user's profile in a new tab
                window.open(item_selected.href, '_blank');
            }
        }
    };
}