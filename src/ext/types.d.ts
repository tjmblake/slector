declare interface Slector {
  data: pathLayer[];
  type: string;
  /** Each Slector has a unique key. */
  key: number;
  query: string;
}

declare interface State {
  /** All available Slector types. This is populated by user on setup. */
  slectorTypes: string[];
  /** The active slector type for Displaying in Popup & Selecting. */
  slectorType: string;
  /** All the slectors created during this session. */
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
