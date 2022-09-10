export const sendSelectMessage = async () => {
  const message: SelectMessage = { head: 'SELECT' };
  await chrome.runtime.sendMessage(message);
};

export const sendSetSelectionType = async (value: string) => {
  const message: SetSlectorTypeMessage = { head: 'SET_SLECTOR_TYPE', body: value };
  await chrome.runtime.sendMessage(message);
};

export const sendDeleteSelectorMessage = async (selectionKey: string) => {
  const message: DeleteSlectorMessage = { head: 'DELETE_SLECTOR', body: selectionKey };
  await chrome.runtime.sendMessage(message);
};

export const sendDoneMessage = async () => {
  const message: DoneMessage = { head: 'DONE' };
  await chrome.runtime.sendMessage(message);
};
