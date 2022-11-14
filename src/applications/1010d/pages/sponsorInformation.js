import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import fullSchema from '../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    veteran: {
      fullName: fullNameUI,
      ssnOrTin: {
        ...ssnUI,
        'ui:title': 'Social Security number or Taxpayer Identification Number',
      },
      vaClaimNumber: {
        'ui:title': 'VA claim number',
      },
      phoneNumber: phoneUI(),
      dateOfBirth: {
        'ui:title': 'Date of birth',
      },
      dateOfMarriage: {
        'ui:title': 'Date of marriage',
      },
      dateOfDeath: {
        'ui:title': 'Date of death',
      },
      isActiveServiceDeath: {
        'ui:title': "Was the Veteran's death during active service?",
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteran,
    },
  },
};
