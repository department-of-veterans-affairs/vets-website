import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';
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
        'ui:errorMessages': {
          required: 'Enter a first name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      middle: {
        'ui:title': 'Spouse’s middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': {
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      last: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
        'ui:title': 'Spouse’s last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      suffix: {
        'ui:title': 'Spouse’s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
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
      'ui:title': 'Is your spouse a Veteran?',
      'ui:widget': 'yesNo',
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    },
    vaFileNumber: {
      ...vaFileNumberUI,
      'ui:title': 'Spouse’s VA file number',
    },
    serviceNumber: {
      'ui:title': 'Spouse’s service number',
      'ui:errorMessages': { pattern: 'Enter a valid Service Number' },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        expandUnder: 'isVeteran',
        hideEmptyValueInReview: true,
      },
    },
  },
};
