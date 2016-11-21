var add_class = function (element, class_name)
{
    // regex to check if the element already has the class
    var regex = new RegExp("(\\s|^)" + class_name + "(\\s|$)", "g");
    if (regex.test(element.className))
    {
        return true;
    }

    if (element.className != "")
    { element.className += " "; }

    element.className += class_name;
};

var remove_class = function (element, class_name)
{
    // regex to get the class
    var regex = new RegExp("(\\s|^)" + class_name + "(\\s|$)", "g");
    element.className.replace(regex, " ").trim();
};

var is_object = function (variable)
{
    return variable !== null && typeof variable === 'object';
};

var deep_extend = function (out)
{
    // USAGE:
    // var new_obj = deep_extend({}, obj1, obj2);

    out = out || {};

    for (var i = 1; i < arguments.length; i++)
    {
        var obj = arguments[i];

        if (!obj)
        { continue; }

        for (var k in obj)
        if (obj.hasOwnProperty(k))
        {
            out[k] = is_object(obj[k]) ? deep_extend(out[k], obj[k]) : obj[k];
        }
    }
    return out;
};
