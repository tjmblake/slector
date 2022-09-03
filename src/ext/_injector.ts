export const injectSelectScript = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/select.js'],
    });
  }
};

export const injectHighlightScript = async (state: State) => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/highlight.js'],
    });

    const message: HighlightMessage = { head: 'HIGHLIGHT', body: state };
    // Follow on the data
    await chrome.tabs.sendMessage(tab.id, message);
  }
};

export const getLocalStorage = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/getLocalStorage.js'],
    });

    const message: GetLocalStorageMessage = {
      head: 'GET_LOCAL_STORAGE',
    };
    const res = (await chrome.tabs.sendMessage(tab.id, message)) as unknown as LocalStorageDataMessage;

    return res;
  }
};

export const setLocalStorage = async (state: State) => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

  if (tab && typeof tab.id === 'number') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./content/setLocalStorage.js'],
    });

    const message: SetLocalStorageMessage = {
      head: 'SET_LOCAL_STORAGE',
      body: JSON.stringify(state),
    };

    const res = (await chrome.tabs.sendMessage(tab.id, message)) as unknown as { head: string; body: string[] };

    return res;
  }
};
