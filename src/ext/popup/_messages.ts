export const sendSelectMessage = async () => {
  const res = await chrome.runtime.sendMessage({ head: 'select' });
  console.log('Select Script Launched');
  console.log(res);
};

export const sendInitMessage = async () => {
  const res = await chrome.runtime.sendMessage({ head: 'init' });
  console.log('Init Response Recieved:');
  console.log(res);
};

export const sendSelectionTypeMessage = async (value: string) => {
  console.log(value);
  const res = await chrome.runtime.sendMessage({ head: 'setSlectorType', body: value });
  console.log(res);
};

export const sendDeleteSelectorMessage = async (selectionKey: string) => {
  await chrome.runtime.sendMessage({ head: 'deleteSelector', body: selectionKey });
};
