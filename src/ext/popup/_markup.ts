/**
 * Generates markup for the selection type dropdown.
 * @param selectionTypes
 * @param selectionType
 * @returns
 */
export const selectionTypes = (selectionTypes: string[], selectionType: string) => {
  const markup = selectionTypes
    .map((el) => `<option value="${el}" ${selectionType === el ? 'selected="selected"' : ''}>${el}</option>`)
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
    .filter((slector) => slector.selectionType === selectionType)
    .map((slector) => {
      const value = slector.data[0].content.find((el) => el.type === 'localName')?.value;
      return `<div class='' data-selection-key='${slector.selectionKey}'>${value}<button class='editSelector'>Edit</button><button class='deleteSelector'>Delete</button></div>`;
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
            `<td class="${pD.type} ${pD.active ? '' : 'deselected'}" data-key="${pD.key}" data-layer="${layer.layer}">${
              pD.value
            }</td>`,
        )
        .join('');
      return `<tr>${row}</tr>`;
    })
    .join('');
  return markup;
};
