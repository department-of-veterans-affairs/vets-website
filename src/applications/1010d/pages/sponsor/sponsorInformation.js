import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { sponsorFields } from '../../definitions/constants';
import fullSchema from '../../10-10D-schema.json';

const { properties } = fullSchema.properties.veteran;

export default {
  uiSchema: {
    [sponsorFields.parentObject]: {
      [sponsorFields.fullName]: fullNameUI,
      [sponsorFields.ssn]: ssnUI,
      [sponsorFields.claim]: {
        'ui:title': 'VA file number (claim number)',
      },
      [sponsorFields.phone]: phoneUI('Phone number'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [sponsorFields.parentObject]: {
        type: 'object',
        required: [
          sponsorFields.fullName,
          sponsorFields.ssn,
          sponsorFields.claim,
          sponsorFields.phone,
        ],
        properties: {
          [sponsorFields.fullName]: properties[sponsorFields.fullName],
          [sponsorFields.ssn]: properties[sponsorFields.ssn],
          [sponsorFields.claim]: properties[sponsorFields.claim],
          [sponsorFields.phone]: properties[sponsorFields.phone],
        },
      },
    },
  },
};
