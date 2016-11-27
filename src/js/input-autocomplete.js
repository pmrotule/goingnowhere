const GITHUB_TOKEN = "f28435cfc0d491276c66b6509818317912adc143";
const ENTER_KEY = 13, ARROW_UP_KEY = 38, ARROW_DOWN_KEY = 40;

class InputAutocomplete {
  constructor(input) {
    const MAIN_CLASS = "c-input-autocomplete";

    if (input.classList.contains(`${MAIN_CLASS}__input`))
      return false;
    else
      input.classList.add(`${MAIN_CLASS}__input`);

    const WRAPPER = document.createElement('div');
    WRAPPER.className = MAIN_CLASS;
    input.parentNode.insertBefore(WRAPPER, input);

    const ICON = document.createElement('img');
    ICON.className = `${MAIN_CLASS}__icon`;
    ICON.src = "img/search.svg";
    ICON.draggable = false;
    ICON.onclick = () => input.focus();
    WRAPPER.appendChild(ICON);

    WRAPPER.appendChild(input);

    const MENU_WRAPPER = document.createElement('div');
    MENU_WRAPPER.className = `${MAIN_CLASS}__menu-wrapper`;
    WRAPPER.appendChild(MENU_WRAPPER);

    const MENU = document.createElement('div');
    MENU.className = `${MAIN_CLASS}__menu ${MAIN_CLASS}__menu--hidden`;
    MENU_WRAPPER.appendChild(MENU);

    Object.assign(this, { input, menu: MENU, fetchId: null, oldValue: "" });

    input.addEventListener('keyup',   event => this.onQueryChange(event));
    input.addEventListener('keydown', event => this.onMenuControl(event));
    input.addEventListener('focus',   () => this.showMenu());

    MENU.addEventListener('mousemove', (event) =>
      this.highlightItem(this.getParentItem(event.target))
    );
  }
  onQueryChange() {
    const API_URL = "https://api.github.com/search/users";
    const QUERY = this.input.value.trim();

    if (QUERY === "") {
      this.hideMenu();
      return false;
    }
    if (this.oldValue === QUERY) {
      return false;
    }

    this.fetchFrom(`${API_URL}?q=${QUERY}&access_token=${GITHUB_TOKEN}`,
      response => this.renderMenu(response, QUERY)
    );
  }
  onMenuControl(event) {
    const KEY = event.which || event.keyCode;

    if (KEY === ENTER_KEY) {
      event.preventDefault();
      this.input.blur();
      this.hideMenu();
      window.open(this.getHighlightedItem().href, '_blank');
    }
    else if (KEY === ARROW_DOWN_KEY || KEY === ARROW_UP_KEY) {
      event.preventDefault();
      const ITEMS = this.menu.querySelectorAll('.c-input-autocomplete__item');
      const HIGHLIGHTED = this.getHighlightedItem();

      let index = Array.from(ITEMS).indexOf(HIGHLIGHTED);

      if (KEY == ARROW_DOWN_KEY)
        index++;
      else if (KEY == ARROW_UP_KEY)
        index--;

      this.highlightItem(ITEMS[index]);
    }
  }
  fetchFrom(url, callback) {
    const FETCH_ID = Symbol();
    this.fetchId = FETCH_ID;

    window.fetch(url)
      .then(response => {
        if (response.ok)
          return response.json();
        else
          console.log('Network response was not ok.');
      })
      .then(response_obj => {
        if (FETCH_ID === this.fetchId)
          callback(response_obj)
      })
      .catch(error => console.log(error.stack));
  }
  showMenu() {
    if (this.input.value.trim() !== "")
      this.menu.classList.remove('c-input-autocomplete__menu--hidden');
  }
  hideMenu() {
    this.menu.classList.add('c-input-autocomplete__menu--hidden');
  }
  renderMenu(response, query) {
    const ITEMS = this.createItems(response, query);
    this.menu.innerHTML = "";

    const TITLE = document.createElement('div');
    TITLE.className = "c-input-autocomplete__menu-title";
    TITLE.innerText = this.getTitle(ITEMS.length);
    this.menu.appendChild(TITLE);

    ITEMS.map((item, index) => {
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
      const WRAPPER = document.createElement('a');
      WRAPPER.className = "c-input-autocomplete__item";
      WRAPPER.href = item.html_url;
      WRAPPER.target = "_blank";
      WRAPPER.onclick = () => this.hideMenu();

      const AVATAR = document.createElement('img');
      AVATAR.className = "c-input-autocomplete__avatar";
      AVATAR.src = item.avatar_url;
      AVATAR.draggable = false;
      WRAPPER.appendChild(AVATAR);

      const NAME = document.createElement('div');
      NAME.className = "c-input-autocomplete__username";
      NAME.innerHTML = item.login
        .replace(new RegExp(`(${query})`, 'ig'), '<b>$1</b>');
      WRAPPER.appendChild(NAME);

      return WRAPPER;
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
