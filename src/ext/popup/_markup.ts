/**
 * Generates markup for the selection type dropdown.
 * @param selectionTypes
 * @param selectionType
 * @returns
 */
export const selectionTypes = (selectionTypes: string[], selectionType: string) => {
  const markup = selectionTypes
    .map(
      (el, i) =>
        `<div class="nav__slector-type"><input name="active-type" id="${i}" type="radio" value="${el}" ${
          selectionType === el ? 'checked' : ''
        } />
        <label for="${i}">${el}</label></div>
        `,
    )
    .join('');
  return markup;
};

/**
 * Generates markup for the list of selectors of the current selection type.
 * @param slectors
 * @param selectionType
 * @returns
 */
export const listSelectors = (slectors: Slector[], selectionType: string) => {
  const markup = slectors
    .filter((slector) => slector.type === selectionType)
    .map((slector) => {
      const value = slector.data[0].content.find((el) => el.type === 'localName')?.value;
      return `<div class='slector' data-selection-key='${slector.key}'>
      <button class='slector__edit btn'><img class="btn__icon"  src="./icons/tune.svg"></button>
      <span class="slector__name">${value}</span>
      <button class='slector__delete btn'><img class="btn__icon" src="./icons/bin.svg"></button></div>`;
    })
    .join('');
  return markup;
};

export const editTableMarkup = (active: Slector) => {
  const markup = active.data
    .map((layer) => {
      const row = layer.content
        .map(
          (pD) =>
            `<button class="btn cell cell__${pD.type} ${pD.active ? '' : 'cell__disabled'}" data-key="${
              pD.key
            }" data-layer="${layer.layer}">${pD.value}</button>`,
        )
        .join('');
      return `<div class="edit-menu__row">${row}</div>`;
    })
    .join('');
  return markup;
};
