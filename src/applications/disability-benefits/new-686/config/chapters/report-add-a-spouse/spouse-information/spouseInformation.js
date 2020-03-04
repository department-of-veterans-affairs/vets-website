import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import { isChapterFieldRequired } from '../../../helpers';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';

const {
  fullName,
  genericNumberAndDashInput: identificationPattern,
  date,
} = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    spouseFullName: fullName,
    spouseSSN: identificationPattern,
    spouseDOB: date,
    isSpouseVeteran: {
      type: 'boolean',
    },
    spouseVAFileNumber: identificationPattern,
    spouseServiceNumber: identificationPattern,
  },
};

export const uiSchema = {
  'ui:title': 'Your spouse’s information',
  spouseFullName: {
    'ui:validations': [validateName],
    first: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'Your spouse’s first name',
      'ui:errorMessages': { required: 'Please enter a first name' },
    },
    middle: {
      'ui:title': 'Your spouse’s middle name',
    },
    last: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'Your spouse’s last name',
      'ui:errorMessages': { required: 'Please enter a last name' },
    },
    suffix: {
      'ui:title': 'Spouse’s suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
  spouseSSN: {
    ...ssnUI,
    ...{
      'ui:title': 'Spouse’s Social Security number',
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    },
  },
  spouseDOB: {
    ...currentOrPastDateUI('Spouse’s date of birth'),
    ...{
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    },
  },
  isSpouseVeteran: {
    'ui:title': 'Is your spouse a veteran?',
    'ui:widget': 'yesNo',
    'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
  },
  spouseVAFileNumber: {
    'ui:title': 'Spouse’s VA file number',
    'ui:errorMessages': { pattern: 'Please enter a valid VA File number' },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      expandUnder: 'isSpouseVeteran',
    },
  },
  spouseServiceNumber: {
    'ui:title': 'Spouse’s service number',
    'ui:errorMessages': { pattern: 'Please enter a valid Service Number' },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      expandUnder: 'isSpouseVeteran',
    },
  },
};
