auto_complete_ajax.prototype.ajax_success = function (response)
{
    var p = this.params;
    var query = this.input.value.trim();
    var items = p.create_items(query, response);
    var count = items.length < p.items_limit ? items.length : p.items_limit;

    this.container.innerHTML = "";

    if (p.menu_title)
    {
        // title goes on top of the results
        var title = document.createElement('div');
        title.className = "c-auto-complete-ajax__title";

        switch (count) {
            case 0 :
                title.innerText = p.menu_title.no_results;
                break;
            case 1 :
                title.innerText = p.menu_title.singular;
                break;
            default :
                title.innerText = p.menu_title.plural;
        }
        this.container.appendChild(title);
    }

    for (var i = 0; i < count; i++)
    {
        // add the class to the item element
        add_class(items[i], "c-auto-complete-ajax__item");

        // add the class to the bold and strong tags
        var bold_elements = items[i].querySelectorAll("b, strong");

        for (var j = 0; j < bold_elements.length; j++)
        { add_class(bold_elements[j], "c-auto-complete-ajax__bold"); }

        // highlight first result
        if (i === 0)
        { this.highlight_item(items[i]); }

        this.container.appendChild(items[i]);
    }

    this.show_menu();
    this.old_value = this.input.value.trim();
};

auto_complete_ajax.prototype.arrow_navigate = function (e)
{
    var key = e.which || e.keyCode;

    if (key == 40 || key == 38) // down or up
    {
        e.preventDefault();

        var items = this.container
            .querySelectorAll('.c-auto-complete-ajax__item');
        var item_highlighted = this.get_highlighted_item();

        if (item_highlighted === null)
        {
            console.log("No anchor were highlighted.");
            return false;
        }

        var index = null;

        for (var i = 0; i < items.length; i++)
        {
            if (items[i] === item_highlighted)
            { index = i; }
        }

        if (key == 40) // down
        { index++; }

        if (key == 38) // up
        { index--; }

        if (items[index])
        { this.highlight_item(items[index]); }
    }
};

auto_complete_ajax.prototype.element_is_item = function (element)
{
    return /(\s|^)c-auto-complete-ajax__item(\s|$)/.test(element.className);
};

auto_complete_ajax.prototype.element_is_menu = function (element)
{
    return /(\s|^)c-auto-complete-ajax(\s|$)/.test(element.className);
};

auto_complete_ajax.prototype.closest_item = function (element)
{
    while (!this.element_is_item(element) && !this.element_is_menu(element))
    {
        element = element.parentNode;
    }
    return this.element_is_menu(element) ? null : element;
};

auto_complete_ajax.prototype.get_highlighted_item = function ()
{
    return this.container
        .querySelector('.c-auto-complete-ajax__item--highlight');
};

auto_complete_ajax.prototype.highlight_item = function (anchor)
{
    if (!anchor)
    { return false; }

    var item_highlighted = this.get_highlighted_item();
    var item_class = "c-auto-complete-ajax__item";
    var b_class = "c-auto-complete-ajax__bold";

    if (item_highlighted !== null)
    {
        remove_class(item_highlighted, item_class + "--highlight");

        var bold_highlighted =
        item_highlighted.querySelectorAll("." + b_class);

        for (var i = 0; i < bold_highlighted.length; i++)
        { remove_class(bold_highlighted[i], b_class + "--highlight"); }
    }

    add_class(anchor, item_class + "--highlight");

    var bold_elements = anchor.querySelectorAll("." + b_class);

    for (var i = 0; i < bold_elements.length; i++)
    { add_class(bold_elements[i], b_class + "--highlight"); }
};

auto_complete_ajax.prototype.show_menu = function ()
{
    var base_class = "c-auto-complete-ajax";
    remove_class(this.container, base_class + "--hidden");
    add_class(this.container, base_class + "--visible");
};

auto_complete_ajax.prototype.hide_menu = function ()
{
    var base_class = "c-auto-complete-ajax";
    remove_class(this.container, base_class + "--visible");
    add_class(this.container, base_class + "--hidden");
};
