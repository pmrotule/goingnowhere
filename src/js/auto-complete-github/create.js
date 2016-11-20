const g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
var g_res_limit = 5;

function auto_complete_github(input)
{
    // check if the autocomplete has already been created
    if (/(\s|^)auto-complete-github__input(\s|$)/.test(input.className))
    {
        return false;
    }
    else
    {
        if (input.className != "")
        { input.className += " "; }

        input.className += "auto-complete-github__input";
    }

    // create the main wrapper and insert it in the document
    var wrapper = document.createElement('div');
    wrapper.className = "auto-complete-github";
    input.parentNode.insertBefore(wrapper, input);

    // create the search icon and append it to the wrapper
    var icon = document.createElement('img');
    icon.className = "auto-complete-github__search-icon";
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = function()
    {
        input.focus();
    };
    wrapper.appendChild(icon);

    // append the input to the wrapper
    wrapper.appendChild(input);

    // create the menu
    var menu = document.createElement('div');
    menu.className = "auto-complete-github__list-wrapper";

    // create the results wrapper and append it to the menu
    var list = document.createElement('div');
    var list_className = "auto-complete-github__list";
    list.className = list_className + " " + list_className + "--hidden";
    menu.appendChild(list);

    // append the menu to the wrapper
    wrapper.appendChild(menu);

    // attach relevant data to the instance
    this.input = input;
    this.list = list;
    this.xhr = null;
    this.old_value = "";

    // .bind(this) to use "this" keyword as the instance instead of the input
    input.addEventListener('keyup',   this.input_onkeyup.bind(this));
    input.addEventListener('keydown', this.input_onkeydown.bind(this));
    input.addEventListener('focus',   this.input_onfocus.bind(this));

    // better using mousemove than mouseover:
    // in case the user used the arrow keys to change the highlighted item
    // between two mouse movements over the same item
    list.addEventListener('mousemove', this.list_onmousemove.bind(this));
    list.addEventListener('click',     this.list_onclick.bind(this));
};
