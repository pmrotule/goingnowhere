// Add autocomplete functionality to an input using ajax calls on keyup. As the
// user types, results will show up in the menu.
function auto_complete_ajax(params)
{
    /* Mandatory parameters are marked with an asterisk
    params = {
        input* : input element,
        wrapper : wrapper element with position absolute
                  (where the results container is appended),

        ajax_url* : XMLHttpRequest url -> Can be a string or a function
                    returning a string. The function would be called before each
                    request. e.g. function (query) {}

        ajax_error : callback function on error,

        menu_title : { // text displayed at the top of the menu
            no_results : "NO RESULTS", // if you set menu_title, you need to
            singular : "ONE RESULT",   // define all three properties
            plural : "SEVERAL RESULTS"
        },
        create_items* : function returning an array of item elements to append
                        to the results container
                        e.g. function (query, ajax_response) {}

        items_limit : the limit of items to display (default: 5),
        onselect* : function called when a selection is made
                    e.g. function (item_element_selected, context)
                    (context would be "enter" or "click")
    };
    */
    var p_default = {
        ajax : {
            error : function ()
            { alert('An error occured.'); }
        },
        items_limit : 5
    };
    var p = Object.assign({}, p_default, params);

    // check if the autocomplete has already been created
    if (/(\s|^)js-auto-complete-ajax-active(\s|$)/.test(p.input.className))
    {
        return false;
    }
    else
    {
        if (p.input.className != "")
        { p.input.className += " "; }

        p.input.className += "js-auto-complete-ajax-active";
    }

    // create the results container
    var container = document.createElement('div');
    var container_class = "c-auto-complete-ajax";
    container.className = container_class + " " + container_class + "--hidden";

    // If no wrapper element has been defined, insert the container after the
    // input element
    if (!p.wrapper || !p.wrapper.nodeType)
    {
        // insertBefore in that case will insert after
        p.input.parentNode.insertBefore(container, p.input.nextSibling);
        add_class(container, "c-auto-complete-ajax--absolute");
    }
    else
    { p.wrapper.appendChild(container); }

    // attach relevant data to the instance
    this.params = p;
    this.input = p.input;
    this.container = container;
    this.xhr = null;
    this.old_value = "";

    // .bind(this) to use "this" keyword as the instance instead of the input
    p.input.addEventListener('keyup',   this.input_onkeyup.bind(this));
    p.input.addEventListener('keydown', this.input_onkeydown.bind(this));
    p.input.addEventListener('focus',   this.input_onfocus.bind(this));

    // better using mousemove than mouseover:
    // in case the user used the arrow keys to change the highlighted item
    // between two mouse movements over the same item
    container.addEventListener('mousemove',
        this.container_onmousemove.bind(this));
    container.addEventListener('click', this.container_onclick.bind(this));
};
