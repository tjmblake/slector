chrome.runtime.onMessage.addListener((message: AllMessages, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'SET_LOCAL_STORAGE') {
    localStorage.setItem('done', message.body);

    sendResponse({ head: 'SET_LOCAL_STORAGE_CONFIRMATION' });

    return true;
  }
});
