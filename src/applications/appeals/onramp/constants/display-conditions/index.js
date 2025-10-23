import { section1DCs } from './section-1';
import { section2DCs } from './section-2';
import { resultsDCs } from './results';
import {
  resultsDRDynamicContentDCs,
  resultsNonDRDynamicContentDCs,
} from './results-dynamic-content';

// Refer to the README in this directory for an explanation of display conditions
export const DISPLAY_CONDITIONS = Object.freeze({
  ...section1DCs,
  ...section2DCs,
  ...resultsDCs,
  ...resultsDRDynamicContentDCs,
  resultsNonDRDynamicContentDCs,
});
