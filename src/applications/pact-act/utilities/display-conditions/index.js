import { burnPitDCs } from './burn-pit';
import { orangeDCs } from './agent-orange';
import { radiationDCs } from './radiation';
import { lejeuneDCs } from './lejeune';

// Refer to the README in this directory for an explanation of display conditions
export const DISPLAY_CONDITIONS = {
  SERVICE_PERIOD: {},
  ...burnPitDCs,
  ...orangeDCs,
  ...radiationDCs,
  ...lejeuneDCs,
};
