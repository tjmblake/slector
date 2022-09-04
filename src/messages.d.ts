declare type AllMessages =
  | SetSlectorTypeMessage
  | EditSlectorMessage
  | DeleteSlectorMessage
  | InitMessage
  | DoneMessage
  | SelectMessage
  | GetStateMessage
  | GetLocalStorageMessage
  | SetLocalStorageMessage
  | LocalStorageDataMessage
  | NewSlectorMessage
  | HighlightMessage
  | TextContentMessage;

declare type SelectMessage = { head: 'SELECT' };
declare type InitMessage = { head: 'INIT' };
declare type GetStateMessage = { head: 'GET_STATE' };

declare type EditSlectorMessage = { head: 'EDIT_SLECTOR'; body: EditSlectorBody };
declare type EditSlectorBody = [activeKey: number, layer: number, key: number];
declare type NewSlectorMessage = { head: 'NEW_SLECTOR'; body: pathLayer[] };

declare type SetSlectorTypeMessage = { head: 'SET_SLECTOR_TYPE'; body: SetSlectorTypeBody };
declare type SetSlectorTypeBody = string;

declare type DeleteSlectorMessage = { head: 'DELETE_SLECTOR'; body: DeleteSelectorBody };
declare type DeleteSlectorBody = string;

declare type GetLocalStorageMessage = { head: 'GET_LOCAL_STORAGE' };
declare type LocalStorageDataMessage = { head: 'LOCAL_STORAGE_DATA'; body: localStorageBody };

declare type SetLocalStorageMessage = { head: 'SET_LOCAL_STORAGE'; body: string };

declare type HighlightMessage = { head: 'HIGHLIGHT'; body: State };
declare type TextContentMessage = { head: 'TEXT_CONTENT'; body: { textContent: string[]; slector: Slector } };
declare type DoneMessage = { head: 'DONE' };
