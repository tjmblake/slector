declare interface Slector {
  data: pathData[];
  selectionType: string;
  selectionKey: number;
}

declare interface State {
  selectionTypes: string[];
  selectionType: string;
  slectors: Slector[];
}

declare interface pathData {
  localName?: string;
  id?: string;
  className?: string;
  classes?: string[];
}
