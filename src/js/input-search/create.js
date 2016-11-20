var g_input_search_count = 0;

function create_input_search_from(input)
{
    // check if the "input-search" has already been created
    if (/(\s|^)c-input-search(\s|$)/.test(input.className))
    {
        return false;
    }
    else
    {
        if (input.className != "")
        { input.className += " "; }

        input.className += "c-input-search";
    }

    // create the wrapper and insert it in the document
    var wrapper = document.createElement('div');
    wrapper.className = "input-search-wrapper";
    input.parentNode.insertBefore(wrapper, input);

    // create the search icon and append it to the wrapper
    var icon = document.createElement('img');
    icon.className = "input-search-icon";
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = function()
    {
        input.focus();
    };
    wrapper.appendChild(icon);

    // append the input to the wrapper
    wrapper.appendChild(input);

    // Create the menu and append it to the wrapper.
    // The menu is ready to accept items but it is not mandatory. It is created
    // no matter what since it has the box-shadow property.
    var menu = document.createElement('div');
    menu.className = "input-search__menu";
    wrapper.appendChild(menu);

    // reverse the default z-index order of occurrence to prevent a menu from
    // being covered by another input-search
    wrapper.style.zIndex = 400 - g_auto_complete_ajax_count;

    g_input_search_count++;
};
