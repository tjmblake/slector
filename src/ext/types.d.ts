declare interface Slector {
  data: pathLayer[];
  type: string;
  /** Each Slector has a unique key. */
  key: number;
}

declare interface State {
  slectorTypes: string[];
  /** The active slector type for Displaying in Popup & Selecting. */
  slectorType: string;
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
