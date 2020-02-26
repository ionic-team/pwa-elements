export interface MediaSettingsRange {
  min: number;
  max: number;
  step: number;
}

export interface PhotoCapabilities {
  redEyeReduction: "never" | "always" | "controllable";
  imageHeight: MediaSettingsRange;
  imageWidth: MediaSettingsRange;
  fillLightMode: string[];
}

export type FlashMode = "auto" | "off" | "flash";


export enum ActionSheetOptionStyle {
  Default = 'DEFAULT',
  Destructive = 'DESTRUCTIVE',
  Cancel = 'CANCEL'
}

export interface ActionSheetOption {
  title: string;
  style?: ActionSheetOptionStyle;
}
