"use strict";

auto_complete_ajax.prototype.ajax_success = function (response) {
    var p = this.params;
    var items = p.create_items(response);
    var count = items.length < p.items_limit ? items.length : p.items_limit;

    p.wrapper.innerHTML = "";

    if (p.menu_title) {
        // title goes on top of the results
        var title = document.createElement('div');
        title.className = "auto-complete-ajax__title";

        switch (count) {
            case 0:
                title.innerText = p.menu_title.no_results;
                break;
            case 1:
                title.innerText = p.menu_title.singular;
                break;
            default:
                title.innerText = p.menu_title.plural;
        }
        p.wrapper.appendChild(title);
    }

    for (var i = 0; i < count; i++) {
        add_class(items[i], "auto-complete-ajax__item");

        if (i === 0) // highlight first result
            {
                this.highlight_item(items[i]);
            }

        p.wrapper.appendChild(items[i]);
    }

    this.show_menu();
    this.old_value = p.input.value.trim();
};

auto_complete_ajax.prototype.arrow_navigate = function (e) {
    var input = this.input;
    var key = e.which || e.keyCode;

    if (key == 40 || key == 38) // down or up
        {
            e.preventDefault();

            var items = this.list.querySelectorAll('.auto-complete-ajax__list-item');
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
};

auto_complete_github.prototype.element_is_item = function (element) {
    return (/(\s|^)auto-complete-github__list-item(\s|$)/.test(element.className)
    );
};

auto_complete_github.prototype.element_is_menu = function (element) {
    return (/(\s|^)auto-complete-github__list-wrapper(\s|$)/.test(element.className)
    );
};

auto_complete_github.prototype.closest_anchor = function (element) {
    while (!this.element_is_item(element) && !this.element_is_menu(element)) {
        element = element.parentNode;
    }
    return this.element_is_menu(element) ? null : element;
};

auto_complete_github.prototype.get_highlighted_item = function () {
    return this.list.querySelector('.auto-complete-github__list-item--highlight');
};

auto_complete_github.prototype.highlight_item = function (anchor) {
    if (!anchor) {
        return false;
    }

    var input = this.input;
    var item_highlighted = this.get_highlighted_item();
    var prefix_class = "auto-complete-github__list";
    var item_class = prefix_class + "-item";
    var username_b_class = prefix_class + "-username-b";

    if (item_highlighted !== null) {
        item_highlighted.className = item_class;
        var bold_highlighted = item_highlighted.querySelectorAll("." + username_b_class);

        for (var i = 0; i < bold_highlighted.length; i++) {
            bold_highlighted[i].className = username_b_class;
        }
    }

    anchor.className = item_class + " " + item_class + "--highlight";

    var bold_elements = anchor.querySelectorAll("." + username_b_class);

    for (var i = 0; i < bold_elements.length; i++) {
        bold_elements[i].className = username_b_class + " " + username_b_class + "--highlight";
    }
};

auto_complete_github.prototype.show_menu = function () {
    var input = this;
    var base_class = "auto-complete-github__list";

    this.list.className = base_class + " " + base_class + "--visible";
};

auto_complete_github.prototype.hide_menu = function () {
    var input = this;
    var base_class = "auto-complete-github__list";

    this.list.className = base_class + " " + base_class + "--hidden";
};