import * as address from 'platform/forms-system/src/js/definitions/address';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullSchema from '../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    veteran: {
      address: address.uiSchema(),
      fullName: fullNameUI,
      ssnOrTin: ssnUI,
      vaClaimNumber: {
        'ui:title': 'VA claim number',
      },
      phoneNumber: phoneUI('Phone number'),
      dateOfBirth: currentOrPastDateUI('Date of birth'),
      dateOfMarriage: currentOrPastDateUI('Date of marriage'),
      isDeceased: {
        'ui:title': 'Is the Veteran deceased?',
      },
      dateOfDeath: {
        ...currentOrPastDateUI('Date of death'),
        'ui:options': {
          hideIf: formData => !formData.veteran.isDeceased,
        },
      },
      isActiveServiceDeath: {
        'ui:title': "Was the Veteran's death during active service?",
        'ui:options': {
          hideIf: formData => !formData.veteran.isDeceased,
        },
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
