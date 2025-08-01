import { section1DCs } from './section-1';
import { section2DCs } from './section-2';

// Refer to the README in this directory for an explanation of display conditions
export const DISPLAY_CONDITIONS = Object.freeze({
  ...section1DCs,
  ...section2DCs,
});
