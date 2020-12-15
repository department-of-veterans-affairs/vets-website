import { firstNameError, lastNameError } from '../../../constants/labels';

const uiSchema = {
  first: {
    'ui:title': 'Your first name',
    'ui:errorMessages': {
      required: firstNameError,
    },
  },
  last: {
    'ui:title': 'Your last name',
    'ui:errorMessages': {
      required: lastNameError,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};

export default uiSchema;
