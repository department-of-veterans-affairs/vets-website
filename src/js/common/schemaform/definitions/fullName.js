import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.fullName;

export const uiSchema = {
  first: {
    'ui:title': 'First name'
  },
  last: {
    'ui:title': 'Last name'
  },
  middle: {
    'ui:title': 'Middle name'
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium'
    }
  }
};
