import issuesWidget from './issuesWidget';

export const uiSchema = {
  'ui:title': 'All issues',
  listOfIssues: {
    'ui:title': ' ',
    'ui:field': 'StringField', // this is necessary, but shows type errors
    'ui:widget': issuesWidget,
  },
};

export const schema = {
  type: 'object',
  properties: {
    listOfIssues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {}, // we won't render any form elements here
      },
    },
  },
};
