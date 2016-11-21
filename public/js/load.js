'use strict';

window.addEventListener('load', function () {
    var input_search = document.querySelector('.js-github-user-search');

    var input_elements = create_input_search_from(input_search);
    var auto_complete_params = github_user_result(input_elements.input, input_elements.menu);

    new auto_complete_ajax(auto_complete_params);
});