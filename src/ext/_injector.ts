export const injectSelectScript = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/select.js'],
    });
  }
};

export const injectQueryScript = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/select.js'],
    });
  }
};

export const getLocalStorage = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/getLocalStorage.js'],
    });

    const res = (await chrome.tabs.sendMessage(tab.id, {
      head: 'getLocalStorage',
    })) as unknown as { head: string; body: string[] };

    return res;
  }
};
