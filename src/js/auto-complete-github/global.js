auto_complete_github.http_request_success = function(response)
{
    var input = this;
    var query = input.value.trim();
    response = JSON.parse(response);

    input.auto_complete_github.list.innerHTML = "";

    if (!response.items)
    { return false; }

    var nb = response.items.length < g_res_limit ?
    response.items.length : g_res_limit;

    // title goes on top of the results
    var title = document.createElement('div');
    title.className = "auto-complete-github__list-title";
    title.innerText = !nb ? "NO RESULTS" :
    "GITHUB USER" + (nb > 1 ? "S" : "");

    input.auto_complete_github.list.appendChild(title);

    for (var i = 0; i < nb; i++)
    {
        var items = auto_complete_github.
        create_item_anchor(query, response.items[i]);

        if (i === 0) // highlight first result
        { auto_complete_github.highlight_item.call(input, items); }

        input.auto_complete_github.list.appendChild(items);
    }

    auto_complete_github.show_menu.call(input);
    input.auto_complete_github.old_value = query;
};

auto_complete_github.http_request_error = function()
{
    alert('An error occured while getting the users from Github.');
};

auto_complete_github.create_item_anchor = function(query, github_data)
{
    var item = document.createElement('a');
    item.className = "auto-complete-github__list-item";
    item.href = github_data.html_url;
    item.target = "_blank";

    var avatar = document.createElement('img');
    avatar.className = "auto-complete-github__list-avatar";
    avatar.src = github_data.avatar_url;
    avatar.draggable = false;

    var name = document.createElement('div');
    var name_class = "auto-complete-github__list-username";
    name.className = name_class;

    name.innerHTML = github_data.login.replace(
        new RegExp("(" + query + ")", "i"),
        '<b class="' + name_class + '-b">$1</b>'
    );

    item.appendChild(avatar);
    item.appendChild(name);

    return item;
};

auto_complete_github.window_open_user_profile = function(e)
{
    var input = this;

    // prevent the menu to reappear when the focus is back on the tab
    input.blur();

    auto_complete_github.hide_menu.call(input);

    var item_highlighted =
    auto_complete_github.get_highlighted_item.call(input);

    // open github user's profile in a new tab
    window.open(item_highlighted.href, '_blank');
};

auto_complete_github.arrow_navigate = function(e)
{
    var input = this;
    var key = e.which || e.keyCode;

    if (key == 40 || key == 38) // down or up
    {
        e.preventDefault();

        var items = input.auto_complete_github.list.
        querySelectorAll('.auto-complete-github__list-item');
        var item_highlighted =
        auto_complete_github.get_highlighted_item.call(input);

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
        { auto_complete_github.highlight_item.call(input, items[index]); }
    }
};

auto_complete_github.element_is_item = function(element)
{
    return /(\s|^)auto-complete-github__list-item(\s|$)/.
    test(element.className);
};

auto_complete_github.element_is_menu = function(element)
{
    return /(\s|^)auto-complete-github__list-wrapper(\s|$)/.
    test(element.className);
};

auto_complete_github.closest_anchor = function(element)
{
    while (!auto_complete_github.element_is_item(element) &&
    !auto_complete_github.element_is_menu(element))
    {
        element = element.parentNode;
    }
    return auto_complete_github.element_is_menu(element) ? null : element;
};

auto_complete_github.get_highlighted_item = function()
{
    var input = this;

    return input.auto_complete_github.list.
    querySelector('.auto-complete-github__list-item--highlight');
};

auto_complete_github.highlight_item = function(anchor)
{
    if (!anchor)
    { return false; }

    var input = this;
    var item_highlighted =
    auto_complete_github.get_highlighted_item.call(input);
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

    var bold_elements =
    anchor.querySelectorAll("." + username_b_class);

    for (var i = 0; i < bold_elements.length; i++)
    {
        bold_elements[i].className =
        username_b_class + " " + username_b_class + "--highlight";
    }
};

auto_complete_github.show_menu = function()
{
    var input = this;
    var base_class = "auto-complete-github__list";

    input.auto_complete_github.list.className =
    base_class + " " + base_class + "--visible";
};

auto_complete_github.hide_menu = function()
{
    var input = this;
    var base_class = "auto-complete-github__list";

    input.auto_complete_github.list.className =
    base_class + " " + base_class + "--hidden";
};
