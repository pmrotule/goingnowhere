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
    element.className = element.className.replace(regex, " ").trim();
};
