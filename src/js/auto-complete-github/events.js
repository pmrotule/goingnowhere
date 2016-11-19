auto_complete_github.input_onkeyup = function()
{
    var input = this;
    var acGIN = input.auto_complete_github;
    var query = input.value.trim();
    var empty = query === "";

    if (empty)
    { auto_complete_github.hide_menu.call(input); }

    if (acGIN.xhr)
    { acGIN.xhr.abort(); }

    if (empty || acGIN.old_value === query)
    { return false; }

    var xhr = new XMLHttpRequest();
    acGIN.xhr = xhr;

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == XMLHttpRequest.DONE)
        {
            acGIN.xhr = null;

            if (xhr.status == 200) // Success
            {
                auto_complete_github.
                http_request_success.call(input, xhr.responseText);
                acGIN.old_value = query;
            }
        }
    };

    xhr.error = auto_complete_github.http_request_error;

    xhr.open("GET",
    "https://api.github.com/search/users?q=" + query +
    "&access_token=" + g_github_token, true);

    xhr.send();
};

auto_complete_github.input_onkeydown = function(e)
{
    if ((e.which || e.keyCode) == 13) // enter
    {
        e.preventDefault();
        auto_complete_github.window_open_user_profile.call(this, e);
    }
    else
    { auto_complete_github.arrow_navigate.call(this, e); }
};

auto_complete_github.input_onfocus = function()
{
    if (this.value.trim() !== "")
    {
        auto_complete_github.show_menu.call(this);
    }
};

auto_complete_github.list_onmousemove = function(e)
{
    var input = this.parentNode.parentNode.querySelector('input');

    auto_complete_github.highlight_item.
    call(input, auto_complete_github.closest_anchor(e.target));
};

auto_complete_github.list_onclick = function()
{
    var input = this.parentNode.parentNode.querySelector('input');
    auto_complete_github.hide_menu.call(input);
};
