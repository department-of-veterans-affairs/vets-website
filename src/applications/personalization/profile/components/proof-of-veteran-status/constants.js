// used to specify whether or not to display proof of veteran status (only honrable discharge)
export const DISCHARGE_CODE_MAP = Object.freeze({
  A: {
    name: 'Honorable',
    indicator: 'Y',
  },
  B: {
    name: 'Under honorable conditions (general)',
    indicator: 'Y',
  },
  D: {
    name: 'Bad conduct',
    indicator: 'N',
  },
  E: {
    name: 'Under other than honorable conditions',
    indicator: 'N',
  },
  F: {
    name: 'Dishonorable',
    indicator: 'N',
  },
  H: {
    name: 'Honorable (Assumed) - GRAS periods only',
    indicator: 'Y',
  },
  J: {
    name: 'Honorable for VA purposes',
    indicator: 'Y',
  },
  K: {
    name: 'Dishonorable for VA purposes',
    indicator: 'N',
  },
  Y: {
    name: 'Uncharacterized',
    indicator: 'Z',
  },
  Z: {
    name: 'Unknown',
    indicator: 'Z',
  },
  DVN: {
    name: 'DoD provided a NULL or blank value',
    indicator: 'Z',
  },
  DVU: {
    name: 'DoD provided a value not in the reference table',
    indicator: 'Z',
  },
  CVI: {
    name: 'Value is calculated but created an invalid value',
    indicator: 'Z',
  },
  VNA: {
    name: 'Value is not applicable for this record type',
    indicator: 'Z',
  },
});
