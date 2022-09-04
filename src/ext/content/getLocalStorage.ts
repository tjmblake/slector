chrome.runtime.onMessage.addListener((message: AllMessages, sender, sendResponse) => {
  console.log(message);

  if (message.head === 'GET_LOCAL_STORAGE') {
    const collectionTypes = localStorage.getItem('collectionTypes');
    const exportTextContent = localStorage.getItem('exportTextContent');
    const slectors = localStorage.getItem('slectors');

    if (collectionTypes) {
      const body: localStorageBody = { collectionTypes: JSON.parse(collectionTypes) };
      if (slectors) body.slectors = JSON.parse(slectors);
      if (exportTextContent) body.exportTextContent = JSON.parse(exportTextContent);

      console.log('COLLECTED FROM LOCAL STORAGE:');
      console.log(body);

      const message: LocalStorageDataMessage = { head: 'LOCAL_STORAGE_DATA', body: body };
      sendResponse(message);
    }

    return true;
  }
});
