let state = {
  currentPickType: 'MethodName',
  editByIndex: false,
  ParentMethod: [],
  MethodName: [],
  FieldName: [],
  FieldDescription: [],
  FieldDataType: [],
  ExampleResponse: [],
  ExampleRequest: [],
};

// EXAMPLE OBJECT:     { savedQuery: '1', editedTable: '' },

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.heading === 'select') {
    state.editByIndex = false;
    injectSelectionScript();
  }

  if (req.heading === 'ChangePickType') {
    state.currentPickType = req.payload;
    sendResponse({ payload: state });
  }

  if (req.heading === 'save') {
    console.log(state);
    sendResponse({
      heading: 'closeEvent',
      payload: state,
    });

    saveLocal();
    return true;
  }

  if (req.heading === 'SetEditByIndex') {
    state.editByIndex = req.payload;
    console.log(state[state.currentPickType][state.editByIndex].editedTable);
    sendResponse({
      payload: state[state.currentPickType][state.editByIndex].editedTable,
    });
    saveLocal();
  }

  if (req.heading === 'DeleteQuery') {
    console.log(req);
    console.log('TO DELETE');
    state[state.currentPickType].splice(req.payload, 1);
    sendToContentScript('Style', state);
    sendResponse({ heading: 'Deleted', payload: state });
    saveLocal();

    return true;
  }

  if (req.heading === 'NewTableData') {
    state[state.currentPickType].push({
      editedTable: req.payload,
      savedQuery: assembleQuery(req.payload),
    });
    sendResponse({ heading: 'UpdatedTableData!' });
    sendToContentScript('Style', state);
    saveLocal();

    return true;
  }

  if (req.heading === 'UpdateTableData') {
    state[state.currentPickType][state.editByIndex] = {
      editedTable: req.payload,
      savedQuery: assembleQuery(req.payload),
    };
    sendResponse({ heading: 'UpdatedTableData!' });
    sendToContentScript('Style', state);
    saveLocal();

    return true;
  }

  if (req.heading === 'openPopup') {
    sendResponse({ payload: state });
    return true;
  }
});

async function injectSelectionScript() {
  let tab = await getCurrentTab();
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['/content/content.css'],
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['/content/content.js'],
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function sendToContentScript(heading, payload) {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { heading, payload });
}

function saveLocal() {
  sendToContentScript('SaveLocal', JSON.stringify(state));
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

function assembleQuery(htmlString) {
  const parseRows = [];
  while (htmlString.length > 0) {
    let startRow = htmlString.indexOf('<tr>');
    let endRow = htmlString.indexOf('</tr>');
    parseRows.push(htmlString.substring(startRow + 4, endRow));
    if (htmlString !== '' && htmlString.length > 6)
      htmlString = htmlString.substring(endRow + 5);
    else htmlString = '';
  }

  const parsedData = [];

  for (let [index, row] of parseRows.entries()) {
    parsedData[index] = [];
    while (row.length > 0) {
      let startData = row.indexOf('<td ');
      let endData = row.indexOf('</td>');
      parsedData[index].push(row.substring(startData, endData + 5));
      if (row !== '' && row.length > 6) row = row.substring(endData + 5);
      else row = '';
    }
  }

  const finalArr = [];

  for (let dataSet of parsedData) {
    let dataSetString = '';
    for (let [index, data] of dataSet.entries()) {
      let classes = data.match(/class="(.*?)">/);
      classes = classes[classes.length - 1].split(' ');

      if (classes.includes('deselected')) {
        continue;
      }

      if (classes[0] === 'localName') {
        const localName = data.match(/localName">(.*?)</);
        if (!localName) continue;
        const location = localName.length === 1 ? 1 : localName.length - 1;
        dataSetString += localName[location];
        continue;
      }

      if (classes[0] === 'localClass') {
        const localClass = data.match(/localClass">(.*?)</);
        if (!localClass) continue;
        const location = localClass.length === 1 ? 1 : localClass.length - 1;
        dataSetString += `.${localClass[location]}`;
      }

      if (classes[0] === 'localId') {
        const localId = data.match(/localId">(.*?)</);
        if (!localId) continue;
        const location = localId.length === 1 ? 1 : localId.length - 1;
        dataSetString += `#${localId[location]}`;
      }
    }
    if (dataSetString.length > 0) finalArr.push(dataSetString);
  }

  console.log(finalArr.reverse().join(' > '));
  return finalArr.join(' > ');
}
