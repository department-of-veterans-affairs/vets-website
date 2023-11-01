import { burnPitDCs } from './burn-pit';
import { orangeDCs } from './agent-orange';
import { radiationDCs } from './radiation';
import { lejeuneDCs } from './lejeune';
import { resultsDCs } from './results-screens';

// Refer to the README in this directory for an explanation of display conditions
export const DISPLAY_CONDITIONS = Object.freeze({
  SERVICE_PERIOD: {},
  ...burnPitDCs,
  ...orangeDCs,
  ...radiationDCs,
  ...lejeuneDCs,
  ...resultsDCs,
});
