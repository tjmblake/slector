chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'getLocalStorage') {
    const collectionSchema = localStorage.getItem('collectionSchema');
    console.log(collectionSchema);
    sendResponse({ head: 'localStorage', message: collectionSchema });
  }
});
