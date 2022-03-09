const uiSchema = {
  first: {
    'ui:title': 'First name',
    'ui:autocomplete': 'given-name',
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:autocomplete': 'family-name',
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:autocomplete': 'additional-name',
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
};

export default uiSchema;
