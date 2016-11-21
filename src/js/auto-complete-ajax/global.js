auto_complete_ajax.prototype.ajax_success = function(response)
{
    var p = this.params;
    var query = p.input.value.trim();

    if (/^\s*[\[\{].*[\]\}]\s*$/.test(response))
    { response = JSON.parse(response); }

    p.wrapper.innerHTML = "";

    var nb = response.items.length < g_res_limit ?
    response.items.length : g_res_limit;

    // title goes on top of the results
    var title = document.createElement('div');
    title.className = "auto-complete-ajax__list-title";
    title.innerText = !nb ? "NO RESULTS" :
    "GITHUB USER" + (nb > 1 ? "S" : "");

    p.wrapper.appendChild(title);

    for (var i = 0; i < nb; i++)
    {
        var items = this.create_item_anchor(query, response.items[i]);

        if (i === 0) // highlight first result
        { this.highlight_item(items); }

        p.wrapper.appendChild(items);
    }

    this.show_menu();
    this.old_value = query;
};

auto_complete_ajax.prototype.create_item_anchor = function(query, ajax_data)
{
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

    name.innerHTML = ajax_data.login.replace(
        new RegExp("(" + query + ")", "i"),
        '<b class="' + name_class + '-b">$1</b>'
    );

    item.appendChild(avatar);
    item.appendChild(name);

    return item;
};

auto_complete_ajax.prototype.window_open_user_profile = function(e)
{
    var input = this.input;

    // prevent the menu to reappear when the focus is back on the tab
    input.blur();
    this.hide_menu();

    // open github user's profile in a new tab
    window.open(this.get_highlighted_item().href, '_blank');
};

auto_complete_ajax.prototype.arrow_navigate = function(e)
{
    var input = this.input;
    var key = e.which || e.keyCode;

    if (key == 40 || key == 38) // down or up
    {
        e.preventDefault();

        var items = this.list
            .querySelectorAll('.auto-complete-ajax__list-item');
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

auto_complete_github.prototype.element_is_item = function(element)
{
    return /(\s|^)auto-complete-github__list-item(\s|$)/
        .test(element.className);
};

auto_complete_github.prototype.element_is_menu = function(element)
{
    return /(\s|^)auto-complete-github__list-wrapper(\s|$)/
        .test(element.className);
};

auto_complete_github.prototype.closest_anchor = function(element)
{
    while (!this.element_is_item(element) && !this.element_is_menu(element))
    {
        element = element.parentNode;
    }
    return this.element_is_menu(element) ? null : element;
};

auto_complete_github.prototype.get_highlighted_item = function()
{
    return this.list
        .querySelector('.auto-complete-github__list-item--highlight');
};

auto_complete_github.prototype.highlight_item = function(anchor)
{
    if (!anchor)
    { return false; }

    var input = this.input;
    var item_highlighted = this.get_highlighted_item();
    var prefix_class = "auto-complete-github__list";
    var item_class = prefix_class + "-item";
    var username_b_class = prefix_class + "-username-b";

    if (item_highlighted !== null)
    {
        item_highlighted.className = item_class;
        var bold_highlighted =
        item_highlighted.querySelectorAll("." + username_b_class);

        for (var i = 0; i < bold_highlighted.length; i++)
        { bold_highlighted[i].className = username_b_class; }
    }

    anchor.className = item_class + " " + item_class + "--highlight";

    var bold_elements = anchor.querySelectorAll("." + username_b_class);

    for (var i = 0; i < bold_elements.length; i++)
    {
        bold_elements[i].className =
        username_b_class + " " + username_b_class + "--highlight";
    }
};

auto_complete_github.prototype.show_menu = function()
{
    var input = this;
    var base_class = "auto-complete-github__list";

    this.list.className =
    base_class + " " + base_class + "--visible";
};

auto_complete_github.prototype.hide_menu = function()
{
    var input = this;
    var base_class = "auto-complete-github__list";

    this.list.className =
    base_class + " " + base_class + "--hidden";
};
