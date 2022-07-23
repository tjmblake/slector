function select() {
  document.body.style.cursor = 'crosshair';
  document.addEventListener('click', sendSelection);

  // chrome.runtime.onMessage.removeListener(messageHandler);
  chrome.runtime.onMessage.addListener(messageHandler);
}

select();

function sendSelection(e) {
  e.preventDefault();
  const temp = [];

  for (let i = 0; i < e.path.length; i++) {
    let data = {};

    if (e.path[i].localName) data.localName = e.path[i].localName;
    else continue;

    if (e.path[i].id) data.id = e.path[i].id;

    if (e.path[i].className)
      data.className = e.path[i].className
        .split(' ')
        .map((el) => el.trim())
        .filter((el) => el !== '');

    temp.push(data);
  }
  let html = '';

  for (let layer of temp) {
    let markup = `<tr><td class="localName">${layer.localName}</td>`;

    if (layer.id) markup += `<td class="localId">${layer.id}</td>`;

    if (layer.className && layer.className.length > 0) {
      for (let el of layer.className) {
        markup += `<td class="localClass">${el}</td>`;
      }
    }

    markup += `</tr>`;

    html += markup;
  }

  chrome.runtime.sendMessage(
    { heading: 'NewTableData', payload: html },
    stopSelectionEvent
  );
}

function stopSelectionEvent(res) {
  console.log(res);
  document.body.style.cursor = 'default';
  document.removeEventListener('click', sendSelection);
}

function messageHandler(req, sender, sendResponse) {
  console.log(req);
  if (req.heading === 'Style') {
    styleEl(req.payload);
  }
  if (req.heading === 'SaveLocal') {
    window.localStorage.setItem('state', req.payload);
  }
}

function styleEl(state) {
  console.log('Styling!');
  console.log(state);
  const notSelectTypes = ['currentPickType', 'editByIndex'];

  for (let selectType of Object.keys(state)) {
    if (notSelectTypes.includes(selectType)) continue;

    document
      .querySelectorAll(`.${selectType}`)
      .forEach((el) => el.classList.remove(selectType));

    if (state[selectType].length === 0) continue;
    for (let query of state[selectType]) {
      console.log(query);
      document
        .querySelectorAll(query.savedQuery)
        .forEach((el) => el.classList.add(`${selectType}`));
    }
  }
}
