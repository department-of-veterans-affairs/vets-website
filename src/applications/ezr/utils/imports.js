import PARTIAL_SCHEMA_EZR from 'vets-json-schema/dist/10-10EZR-schema.json';

export {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/contacts';

const serviceHistoryFragment = {
  lastServiceBranch: {
    type: 'string',
    enum: [
      'air force',
      'army',
      'coast guard',
      'marine corps',
      'merchant seaman',
      'navy',
      'noaa',
      'space force',
      'usphs',
      'f.commonwealth',
      'f.guerilla',
      'f.scouts new',
      'f.scouts old',
      'other',
    ],
  },
  lastEntryDate: {
    $ref: '#/definitions/date',
  },
  lastDischargeDate: {
    $ref: '#/definitions/date',
  },
  dischargeType: {
    type: 'string',
    enum: [
      'honorable',
      'general',
      'other',
      'bad-conduct',
      'dishonorable',
      'undesirable',
    ],
  },
};

export const FULL_SCHEMA = {
  ...PARTIAL_SCHEMA_EZR,
  properties: {
    ...PARTIAL_SCHEMA_EZR.properties,
    ...serviceHistoryFragment,
  },
};
