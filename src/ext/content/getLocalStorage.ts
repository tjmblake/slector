chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'getLocalStorage') {
    const collectionTypes = localStorage.getItem('collectionTypes');
    const slectors = localStorage.getItem('slectors');

    if (collectionTypes) {
      const body: localStorageBody = { collectionTypes: JSON.parse(collectionTypes) };
      if (slectors) body.slectors = JSON.parse(slectors);

      console.log('COLLECTED FROM LOCAL STORAGE:');
      console.log(body);

      sendResponse({ head: 'localStorage', body: body });
    }

    return true;
  }
});
