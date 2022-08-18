declare interface Slector {
  data: pathLayer[];
  selectionType: string;
  selectionKey: number;
}

declare interface State {
  selectionTypes: string[];
  selectionType: string;
  slectors: Slector[];
}

declare interface pathLayer {
  content: pathData[];
  layer: number;
}

declare interface pathData {
  type: 'localName' | 'id' | 'class';
  value: string;
  key: number;
  /** How we toggle the data when using the edit menu. */
  active: boolean;
}
