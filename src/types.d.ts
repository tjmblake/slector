declare interface Slector {
  data: pathLayer[];
  type: string;
  /** Each Slector has a unique key. */
  key: number;
  /** Most recent query, created pre-injection refresh */
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

/**PathLayer reflects each layer within a query.
 *
 * Each layer can include a local name (HTML Element), Classlist and ID.
 */
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

/** Options passed into Slector setup. */
declare interface options {
  /** Should the Chrome Console open for the extension? */
  showExtConsole?: boolean;
  /** Slector types */
  collectionTypes: string[];
  /**The URL the browser will open. */
  startUrl: string;
  /** Previous Slector Data */
  slectors?: Slector[];
}

/** Message body sent from 'getLocalStorage' to 'background' */
declare interface localStorageBody {
  collectionTypes: string[];
  slectors?: Slector[];
}
