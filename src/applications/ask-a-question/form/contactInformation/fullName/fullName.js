const uiSchema = {
  first: {
    'ui:title': 'Your first name',
    'ui:errorMessages': {
      required: 'Please enter your first name',
    },
  },
  last: {
    'ui:title': 'Your last name',
    'ui:errorMessages': {
      required: 'Please enter your last name',
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
