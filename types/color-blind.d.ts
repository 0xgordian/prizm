declare module 'color-blind' {
  export const protanopia: (color: string) => string;
  export const deuteranopia: (color: string) => string;
  export const tritanopia: (color: string) => string;
  export const achromatopsia: (color: string) => string;
}