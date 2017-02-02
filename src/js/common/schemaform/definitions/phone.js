import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

export const schema = fullSchema1995.definitions.phone;

export const uiSchema = (title = 'Phone') => {
  return {
    'ui:title': title,
    'ui:options': {
      widgetClassNames: 'home-phone va-input-medium-large',
      inputType: 'tel'
    }
  };
};
