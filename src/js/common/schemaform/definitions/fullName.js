import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

export const schema = fullSchema1995.definitions.fullName;

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
