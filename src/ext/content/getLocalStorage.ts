chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'getLocalStorage') {
    const collectionTypes = localStorage.getItem('collectionTypes');
    console.log(collectionTypes);

    if (collectionTypes) sendResponse({ head: 'localStorage', body: JSON.parse(collectionTypes) });

    sendResponse({ head: 'localStorage', body: collectionTypes });

    return true;
  }
});
