import * as address from 'platform/forms-system/src/js/definitions/address';
import { intersection, pick } from 'lodash';
import { applicantFields } from '../../definitions/constants';
import fullSchema from '../../10-10D-schema.json';

const { required, properties } = fullSchema.properties.applicants.items;

export default {
  uiSchema: {
    [applicantFields.parentObject]: {
      items: {
        [applicantFields.address]: address.uiSchema(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [applicantFields.parentObject]: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: intersection(required, [applicantFields.address]),
          properties: pick(properties, [applicantFields.address]),
        },
      },
    },
  },
};
