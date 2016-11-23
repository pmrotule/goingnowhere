class InputAutocomplete {
  constructor(input) {
    const main_class = "c-input-autocomplete";

    if (input.classList.contains(`${main_class}__input`)) {
      return false;
    } else {
      input.classList.add(`${main_class}__input`);
    }

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

    Object.assign(this, { input, menu, xhr: null, oldValue: "" });

    input.addEventListener('keyup',   () => this.onkeyup());
    input.addEventListener('keydown', () => this.onkeydown());
    input.addEventListener('focus',   () => this.onfocus());

    menu.addEventListener('click',     () => this.hideMenu());
    menu.addEventListener('mousemove', (event) =>
      this.highlightItem(this.getParentItem(event.target))
    );
  }
}
