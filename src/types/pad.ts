export interface PadConfig {
  id: number;
  name: string;
  shortName: string;
  color: string;
  sampleFile: string;
  row: number;
  col: number;
}

export interface PadState {
  id: number;
  isActive: boolean;
  isHighlighted: boolean;
  velocity: number;
}
