// Add autocomplete functionality to an input using ajax calls on keyup. As the
//user types, results will show up in the menu.
function auto_complete_ajax(params)
{
    /* Mandatory parameters are marked with an asterisk
    params = {
        input* : input element,
        wrapper : wrapper element,
        ajax* : {
            url* : XMLHttpRequest url -> xhr.open("GET", url),
            success* : callback function on success -> function(response){},
            error : callback function on error
        },
        menu_title : { // text displayed at the top of the menu
            no_results : "NO RESULTS", // if you set menu_title, you need to
            singular : "ONE RESULT",   // define all three properties
            plural : "SEVERAL RESULTS"
        },
        create_item : function returning the item element
    };
    */
    var default = {
        ajax : {
            error : function()
            { alert('An error occured.'); }
        }
    };
    var p = deep_extend({}, default, params); // deep_extend set in global.js

    console.log(p);

    // check if the autocomplete has already been created
    if (/(\s|^)js-auto-complete-ajax-active(\s|$)/.test(input.className))
    {
        return false;
    }
    else
    {
        if (input.className != "")
        { input.className += " "; }

        input.className += "js-auto-complete-ajax-active";
    }

    // If no wrapper element has been defined, create one and insert it after
    // the input element
    if (!p.wrapper || !p.wrapper.nodeType)
    {
        p.wrapper = document.createElement('div');
        p.input.parentNode.insertBefore(p.wrapper, p.input.nextSibling);
    }

    // create the results container and append it to the wrapper
    var container = document.createElement('div');
    var container_class = "c-auto-complete-ajax";
    container.className = container_class + " " + container_class + "--hidden";
    wrapper.appendChild(container);

    // attach relevant data to the instance
    this.params = p;
    this.xhr = null;
    this.old_value = "";

    // .bind(this) to use "this" keyword as the instance instead of the input
    input.addEventListener('keyup',   this.input_onkeyup.bind(this));
    input.addEventListener('keydown', this.input_onkeydown.bind(this));
    input.addEventListener('focus',   this.input_onfocus.bind(this));

    // better using mousemove than mouseover:
    // in case the user used the arrow keys to change the highlighted item
    // between two mouse movements over the same item
    container.addEventListener('mousemove',
        this.container_onmousemove.bind(this));
    container.addEventListener('click', this.container_onclick.bind(this));
};
