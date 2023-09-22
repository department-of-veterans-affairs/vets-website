import EmploymentHistoryWidget from '../../../components/employment/EmploymentHistoryWidget';

export const uiSchema = {
  'ui:title': 'Employment history',
  employmentHistory: {
    'ui:title': ' ',
    'ui:field': 'StringField', // this is necessary, but shows type errors
    'ui:widget': EmploymentHistoryWidget,
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
