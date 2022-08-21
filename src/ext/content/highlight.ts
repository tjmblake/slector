chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message: { head: string; body: State }) {
  if (message.head !== 'highlight') return;
  // STYLE STRING
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  const classNames = message.body.slectorTypes.map((el, i) => `slector__${i}`);

  const styles = classNames.map((el: string, i: number) => `.${el} {background-color: ${colors[i]};}`).join(' ');

  const sheetToBeRemoved = document.getElementById('slector');

  if (sheetToBeRemoved) {
    const sheetParent = sheetToBeRemoved.parentNode;
    if (sheetParent) sheetParent.removeChild(sheetToBeRemoved);
  }

  const sheet: HTMLStyleElement = document.createElement('style');
  sheet.innerHTML = styles;
  sheet.id = 'slector';
  document.body.appendChild(sheet);

  // Select elements previously selected
  const previouslySelected = document.querySelectorAll('.slector');
  // Clear all styling
  previouslySelected.forEach((el) => el.classList.remove('slector', ...classNames));
  // Find new elements in query.
  message.body.slectors.forEach((slector, i) => {
    // Select Slector
    const slected = document.querySelectorAll(slector.query);
    // Apply Classes
    slected.forEach((el) =>
      el.classList.add('slector', classNames[message.body.slectorTypes.findIndex((val) => val === slector.type)]),
    );
  });

  chrome.runtime.onMessage.removeListener(handleMessage);
}
