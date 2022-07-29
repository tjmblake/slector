declare interface Slector {
  data: pathData[];
  collection: number;
}

declare interface State {
  collectionTypes: string[];
  activeCollection: number;
  slectors: Slector[];
}

declare interface pathData {
  localName?: string;
  id?: string;
  className?: string;
  classes?: string[];
}
