import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { veteranFields } from '../../../caregivers/definitions/constants';

import fullSchema from '../../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    [veteranFields.fullName]: fullNameUI,
    [veteranFields.ssn]: ssnUI,
    [veteranFields.primaryPhoneNumber]: phoneUI('Primary phone number'),
    [veteranFields.vaClaimNumber]: {
      'ui:title': 'VA claim number',
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.fullName]: veteran.properties.fullName,
      [veteranFields.ssn]: veteran.properties.ssnOrTin,
      [veteranFields.primaryPhoneNumber]: veteran.properties.phoneNumber,
      [veteranFields.vaClaimNumber]: veteran.properties.vaClaimNumber,
    },
  },
};
