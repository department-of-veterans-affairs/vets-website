import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../../10-10D-schema.json';
import { sponsorFields } from '../../definitions/constants';

const { properties } = fullSchema.properties.veteran;

export default {
  uiSchema: {
    [sponsorFields.parentObject]: {
      [sponsorFields.address]: address.uiSchema(''),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [sponsorFields.parentObject]: {
        type: 'object',
        required: [sponsorFields.address],
        properties: {
          [sponsorFields.address]: properties[sponsorFields.address],
        },
      },
    },
  },
};
