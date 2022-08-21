chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'setLocalStorage') {
    localStorage.setItem('done', message.body);

    sendResponse({ head: 'set' });

    return true;
  }
});
