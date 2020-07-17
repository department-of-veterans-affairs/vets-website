import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { isChapterFieldRequired } from '../../../helpers';
import { validateName, addSpouse } from '../../../utilities';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: addSpouse.properties.spouseNameInformation,
  },
};

export const uiSchema = {
  spouseInformation: {
    'ui:title': 'Your spouse’s information',
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
        'ui:title': 'Spouse’s first name',
        'ui:errorMessages': { required: 'Please enter a first name' },
      },
      middle: {
        'ui:title': 'Spouse’s middle name',
      },
      last: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
        'ui:title': 'Spouse’s last name',
        'ui:errorMessages': { required: 'Please enter a last name' },
      },
      suffix: {
        'ui:title': 'Spouse’s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    ssn: {
      ...ssnUI,
      ...{
        'ui:title': 'Spouse’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
      },
    },
    birthDate: {
      ...currentOrPastDateUI('Spouse’s date of birth'),
      ...{
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
      },
    },
    isVeteran: {
      'ui:title': 'Is your spouse a veteran?',
      'ui:widget': 'yesNo',
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    },
    VAFileNumber: {
      'ui:title': 'Spouse’s VA file number',
      'ui:errorMessages': { pattern: 'Please enter a valid VA File number' },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        expandUnder: 'isVeteran',
      },
    },
    serviceNumber: {
      'ui:title': 'Spouse’s service number',
      'ui:errorMessages': { pattern: 'Please enter a valid Service Number' },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        expandUnder: 'isVeteran',
      },
    },
  },
};
