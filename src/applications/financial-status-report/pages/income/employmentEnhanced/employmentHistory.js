import employmentHistoryWidget from './employmentHistoryWidget';

export const uiSchema = {
  'ui:title': 'All issues',
  employmentHistory: {
    'ui:title': ' ',
    'ui:field': 'StringField', // this is necessary, but shows type errors
    'ui:widget': employmentHistoryWidget,
  },
};

export const schema = {
  type: 'object',
  properties: {
    employmentHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {}, // we won't render any form elements here
      },
    },
  },
};
