import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.phone;

export const uiSchema = (title = 'Phone') => {
  return {
    'ui:title': title,
    'ui:options': {
      widgetClassNames: 'home-phone va-input-medium-large',
      inputType: 'tel'
    }
  };
};
