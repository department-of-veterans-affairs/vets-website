/* eslint-disable @department-of-veterans-affairs/telephone-contact-3-or-10-digits */
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { intersection, pick } from 'lodash';
import { sponsorFields } from '../../definitions/constants';
import fullSchema from '../../10-10D-schema.json';

const { required, properties } = fullSchema.properties.veteran;

const pageFields = [
  sponsorFields.fullName,
  sponsorFields.ssn,
  sponsorFields.claim,
  sponsorFields.phone,
];

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
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
