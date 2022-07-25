chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'getLocalStorage') {
    const collectionSchema = localStorage.getItem('collectionSchema');
    console.log(collectionSchema);

    if (collectionSchema) sendResponse({ head: 'localStorage', body: JSON.parse(collectionSchema) });

    sendResponse({ head: 'localStorage', body: collectionSchema });

    return true;
  }
});
