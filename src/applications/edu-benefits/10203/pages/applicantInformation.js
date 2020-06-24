import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export const uiSchema = {
  veteranFullName: {
    first: {
      'ui:title': 'Your first name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    last: {
      'ui:title': 'Your last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    middle: {
      'ui:title': 'Your middle name',
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
  veteranSocialSecurityNumber: { ...ssnUI },
};
