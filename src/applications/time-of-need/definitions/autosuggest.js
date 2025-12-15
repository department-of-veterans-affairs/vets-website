import AutosuggestField from '../components/AutosuggestField';

export const uiSchema = (title, fetchOptionsFn, uiOptions = {}) => ({
  'ui:title': title,
  'ui:field': AutosuggestField,
  'ui:options': {
    getOptions: fetchOptionsFn, // (userInput) => Promise<[{ id, label }]> or array
    ...uiOptions['ui:options'],
  },
  'ui:required': uiOptions['ui:required'],
  'ui:errorMessages': uiOptions['ui:errorMessages'] || {
    required: 'This field is required',
  },
});

export const schema = {
  type: 'string',
};
