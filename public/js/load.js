'use strict';

window.addEventListener('load', function () {
    var auto_complete = document.querySelectorAll('.js-auto-complete-github');

    for (var i = 0; i < auto_complete.length; i++) {
        new auto_complete_github(auto_complete[i]);
    }
});