class Popup {
  constructor() {
    this.currentPickType = '';

    this.DOM = {};
    this.DOM.pickType = document.querySelector('#pickType');
    this.DOM.queryMenu = document.querySelector('#queryMenu');
    this.DOM.table = document.querySelector('#prune');

    this.DOM.table.addEventListener('click', this.adjustTable.bind(this));

    chrome.runtime.sendMessage({ heading: 'openPopup' }, this.init.bind(this));

    // DOM Handlers
    document.getElementById('pickData').addEventListener('click', () => {
      const pickType = this.DOM.pickType.value;
      // To background script
      chrome.runtime.sendMessage({
        heading: 'select',
        payload: pickType,
      });
    });

    document.querySelector('#save').addEventListener('click', function (e) {
      chrome.runtime.sendMessage({ heading: 'save' }, (res) => {
        console.log(res);
        console.log(chrome.storage.sync.get());
      });
    });

    this.DOM.pickType.addEventListener('change', this.changePickType.bind(this));
  }

  init(res) {
    console.log('INIT');
    console.log(res);
    this.currentPickType = res.payload.currentPickType || 'MethodName';

    this.DOM.pickType.value = this.currentPickType;
    this.DOM.queryMenu.innerHTML = '';
    this.DOM.table.innerHTML = '';

    // Get content script to restyle all styles

    if (res.payload[this.currentPickType].length > 0) {
      this.createQueryMenu(res.payload[this.currentPickType]);
    }
  }

  createQueryMenu(queries) {
    let markup = ``;

    for (let [i, query] of queries.entries()) {
      let name = query.savedQuery;

      if (name.length > 10) {
        name = '...' + name.substring(name.length - 10, name.length);
      }

      markup += `<div class='' data-query-index='${i}'>${name}<button class='editQuery'>Edit</button><button class='deleteQuery'>Delete</button></div>`;
    }

    this.DOM.queryMenu.insertAdjacentHTML('afterbegin', markup);

    const editBtns = document.querySelectorAll('.editQuery');
    for (let editBtn of editBtns) {
      editBtn.addEventListener('click', this.editQuery.bind(this));
    }

    const delBtns = document.querySelectorAll('.deleteQuery');
    for (let delBtn of delBtns) {
      delBtn.addEventListener('click', this.deleteQuery.bind(this));
    }
  }

  editQuery(e) {
    chrome.runtime.sendMessage(
      {
        heading: 'SetEditByIndex',
        payload: Number(e.target.parentElement.dataset.queryIndex),
      },
      function (res) {
        console.log('RES');
        console.log(this);
        this.DOM.table.innerHTML = res.payload;
      }.bind(this),
    );
  }

  deleteQuery(e) {
    chrome.runtime.sendMessage(
      {
        heading: 'DeleteQuery',
        payload: Number(e.target.parentElement.dataset.queryIndex),
      },
      this.init.bind(this),
    );
  }

  changePickType(e) {
    chrome.runtime.sendMessage(
      {
        heading: 'ChangePickType',
        payload: e.target.value,
      },
      (res) => {
        this.init(res);
      },
    );
  }

  adjustTable(e) {
    e.target.classList.toggle('deselected');
    this.updateQuery();
  }

  updateQuery() {
    let tableData = this.DOM.table.innerHTML;
    chrome.runtime.sendMessage({
      heading: 'UpdateTableData',
      payload: tableData,
    });

    // const rows = this.DOM.table.querySelectorAll('tr');
    // const query = this.assembleQuery(rows);
    // if (!query) return;

    // chrome.runtime.sendMessage(
    //   { heading: 'UpdateSavedQuery', payload: query },
    //   this.updateTableAndSend.bind(this)
    // );
  }
}

new Popup();
