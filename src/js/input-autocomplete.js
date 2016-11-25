const GITHUB_TOKEN = "f28435cfc0d491276c66b6509818317912adc143";
const KEY_ENTER = 13, KEY_UP = 38, KEY_DOWN = 40;

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
    menu.className = `${main_class}__menu ${main_class}__menu--hidden`;
    menu_wrapper.appendChild(menu);

    Object.assign(this, { input, menu, fetchId: null, oldValue: "" });

    input.addEventListener('keyup',   event => this.onkeyup(event));
    input.addEventListener('keydown', event => this.onkeydown(event));
    input.addEventListener('focus',   () => this.showMenu());

    menu.addEventListener('click', () => this.hideMenu());
    menu.addEventListener('mousemove', (event) =>
      this.highlightItem(this.getParentItem(event.target))
    );
  }
  onkeyup() {
    const api_url = "https://api.github.com/search/users";
    const query = this.input.value.trim();
    const fetchId = Symbol();
    this.fetchId = fetchId;

    if (query === "") {
      this.hideMenu();
      return false;
    }
    if (this.oldValue === query) {
      return false;
    }

    window.fetch(`${api_url}?q=${query}&access_token=${GITHUB_TOKEN}`)
      .then(response => {
        if (response.ok)
          return response.json();
        else
          console.log('Network response was not ok.');
      })
      .then(response_obj => {
        if (fetchId === this.fetchId)
          this.renderMenu(response_obj, query)
      })
      .catch(error => console.dir(error));
  }
  onkeydown(event) {
    const key = event.which || event.keyCode;

    if (key === KEY_ENTER) {
      event.preventDefault();
      this.input.blur();
      this.hideMenu();
      window.open(this.getHighlightedItem().href, '_blank');
    }
    else if (key === KEY_DOWN || key === KEY_UP) {
      event.preventDefault();
      const items = this.menu.querySelectorAll('.c-input-autocomplete__item');
      const highlighted = this.getHighlightedItem();

      let index = Array.from(items).indexOf(highlighted);

      if (key == KEY_DOWN)
        index++;
      else if (key == KEY_UP)
        index--;

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
    const items = this.createItems(response, query);
    this.menu.innerHTML = "";

    const title = document.createElement('div');
    title.className = "c-input-autocomplete__menu-title";
    title.innerText = this.getTitle(items.length);
    this.menu.appendChild(title);

    items.map((item, index) => {
      if (index === 0) {
        item.classList.add('c-input-autocomplete__item--highlight');
      }
      this.menu.appendChild(item);
    });

    this.showMenu();
    this.oldValue = query;
  }
  createItems(response, query) {
    return response.items.slice(0, 5).map(item => {
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

      return wrapper;
    });
  }
  highlightItem(item) {
    if (item) {
      this.getHighlightedItem()
        .classList.remove('c-input-autocomplete__item--highlight');
      item.classList.add('c-input-autocomplete__item--highlight');
    }
  }
  getHighlightedItem() {
    return this.menu.querySelector('.c-input-autocomplete__item--highlight');
  }
  getParentItem(element) {
    while (!element.classList.contains('c-input-autocomplete__item')
    && !element.classList.contains('c-input-autocomplete')) {
      element = element.parentNode;
    }
    return element.classList.contains('c-input-autocomplete') ? null : element;
  }
  getTitle(items_length) {
    return !items_length ? "NO RESULTS" :
    `GITHUB USER${items_length > 1 ? "S" : ""}`;
  }
}
