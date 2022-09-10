/** Selects a group of nodes based on query and then adds a listener.*/
export const all = (query: string, callback: (E: Event) => Promise<void> | void) => {
  const all = document.querySelectorAll(query) as unknown as HTMLButtonElement[] | HTMLElement[];

  all.forEach((el) => {
    el.addEventListener('click', callback);
  });
};
