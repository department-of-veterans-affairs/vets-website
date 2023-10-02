import { orangeDCs } from './agent-orange';
import { burnPitDCs } from './burn-pit';

// Refer to the README in this directory for an explanation of display conditions
export const DISPLAY_CONDITIONS = {
  SERVICE_PERIOD: {},
  ...burnPitDCs,
  ...orangeDCs,
};
