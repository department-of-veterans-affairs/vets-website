import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import fullNameUI from 'platform/forms/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { SpouseBasicInformationDescription } from '../../../components/FormDescriptions';

const {
  dateOfMarriage,
  spouseDateOfBirth,
  spouseFullName,
  spouseSocialSecurityNumber,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': SpouseBasicInformationDescription,
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title': 'Spouse\u2019s first name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Spouse\u2019s middle name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Spouse\u2019s last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': 'Spouse\u2019s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    spouseSocialSecurityNumber: {
      ...ssnUI,
      'ui:title': 'Spouse\u2019s Social Security number',
    },
    spouseDateOfBirth: currentOrPastDateUI('Spouse\u2019s date of birth'),
    dateOfMarriage: currentOrPastDateUI('Date of marriage'),
  },
  schema: {
    type: 'object',
    required: [
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'dateOfMarriage',
    ],
    properties: {
      spouseFullName,
      spouseSocialSecurityNumber,
      spouseDateOfBirth,
      dateOfMarriage,
    },
  },
};
