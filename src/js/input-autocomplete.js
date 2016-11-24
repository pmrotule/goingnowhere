const g_github_token = "f28435cfc0d491276c66b6509818317912adc143";
const g_github_user_results_limit = 5;

class InputAutocomplete {
  constructor(input) {
    const main_class = "c-input-autocomplete";

    if (input.classList.contains(`${main_class}__input`))
      return false;
    else
      input.classList.add(`${main_class}__input`);

    const wrapper = document.createElement('div');
    wrapper.className = main_class;
    input.parentNode.insertBefore(wrapper, input);

    const icon = document.createElement('img');
    icon.className = `${main_class}__icon`;
    icon.src = "img/search.svg";
    icon.draggable = false;
    icon.onclick = () => { input.focus() };
    wrapper.appendChild(icon);

    wrapper.appendChild(input);

    const menu_wrapper = document.createElement('div');
    menu_wrapper.className = `${main_class}__menu-wrapper`;
    wrapper.appendChild(menu_wrapper);

    const menu = document.createElement('div');
    container.className = `${main_class}__menu ${main_class}__menu--hidden`;

    Object.assign(this, { input, menu, fetch: null, oldValue: "" });

    input.addEventListener('keyup',   () => this.onkeyup());
    input.addEventListener('keydown', () => this.onkeydown());
    input.addEventListener('focus',   () => this.showMenu());

    menu.addEventListener('click',     () => this.hideMenu());
    menu.addEventListener('mousemove', (event) =>
      this.highlightItem(this.getParentItem(event.target))
    );
  }
  onkeyup() {
    const api_url = "https://api.github.com/search/users";
    const query = this.input.value.trim();

    if (query === "") {
      this.hideMenu();
      return false;
    }
    if (inst.oldValue === query) {
      return false;
    }
    if (this.fetch) {
      this.fetch.abort();
    }

    const fetch = fetch(`${api_url}?q=${query}&access_token=${g_github_token}`)
      .then(response => {
        if (response.ok)
          this.renderMenu(response.json(), query);
        else
          console.log('Network response was not ok.');
      })
      .catch(error => {
        console.log(`There has been a problem with your fetch operation:
          ${error.message}`);
      });
  }
  onkeydown(event) {
    const key = event.which || event.keyCode;

    if (key === 13) { // enter
      event.preventDefault();
      input.blur();
      this.hideMenu();
      window.open(this.getHighlightedItem().href, '_blank');
    }
    else if (key === 40 || key === 38) { // down or up
      event.preventDefault();
      const highlighted = this.getHighlightedItem();
      const items = highlighted.parentNode.children;

      let index = Array.from(items).indexOf(highlighted);

      if (key == 40) // down
        index++;
      else if (key == 38) { // up
        index--;

      if (items[index])
        this.highlightItem(items[index]);
    }
  }
  showMenu() {
    if (this.input.value.trim() !== "")
      this.menu.classList.remove('c-input-autocomplete__menu--hidden');
  }
  hideMenu() {
    this.menu.classList.add('c-input-autocomplete__menu--hidden');
  }
  renderMenu(response, query) {
    const items = p.createItems(query, response);
    this.menu.innerHTML = "";

    const title = document.createElement('div');
    title.className = "c-auto-complete-ajax__title";
    title.innerText = this.getTitle(items.length);
    this.container.appendChild(title);

    items.map((item, index) => {
      if (index === 0) {
        this.highlightItem(item);
      }
      this.menu.appendChild(item);
    });

    this.showMenu();
    this.oldValue = query;
  }
  getTitle(items_length) {
    return !items_length ? "NO RESULTS" :
    `GITHUB USER${items_length > 1 ? "S" : ""}`;
  }
  createItems(response, query) {
    return response.items.slice(0, g_github_user_results_limit).map(item => {
      const wrapper = document.createElement('a');
      wrapper.className = "c-input-autocomplete__item";
      wrapper.href = item.html_url;
      wrapper.target = "_blank";

      const avatar = document.createElement('img');
      avatar.className = "c-input-autocomplete__avatar";
      avatar.src = item.avatar_url;
      avatar.draggable = false;
      wrapper.appendChild(avatar);

      const name = document.createElement('div');
      name.className = "c-input-autocomplete__username";
      name.innerHTML = item.login
        .replace(new RegExp(`(${query})`, 'ig'), '<b>$1</b>');
      wrapper.appendChild(name);
    });
  }
}
