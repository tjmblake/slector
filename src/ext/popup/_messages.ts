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
  const res = await chrome.runtime.sendMessage({ head: 'setSelectionType', body: value });
};

export const sendDeleteSelectorMessage = async (selectionKey: string) => {
  const res = await chrome.runtime.sendMessage({ head: 'deleteSelector', body: selectionKey });
};
