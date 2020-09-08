import { uiSchema as autoSuggestUiSchema } from 'platform/forms-system/src/js/definitions/autosuggest';
import { validateWhiteSpace } from 'platform/forms/validations';

import fullSchema from '../../0873-schema.json';
import { topicTitle } from '../../content/inquiryPage';
import pageDescription from '../../content/PageDescription';

const { topic, inquiryType, query } = fullSchema.properties;

const formFields = {
  topic: 'topic',
  inquiryType: 'inquiryType',
  query: 'query',
};

const getOptions = allOptions => {
  return (_input = '') => {
    return Promise.resolve(
      allOptions.map(option => ({ id: option, label: option })),
    );
  };
};

const inquiryPage = {
  uiSchema: {
    'ui:description': pageDescription('Your message'),
    [formFields.inquiryType]: {
      'ui:title': "Tell us the reason you're contacting us",
    },
    [formFields.topic]: autoSuggestUiSchema(
      topicTitle,
      getOptions(topic.enum),
      {
        'ui:options': { queryForResults: true, freeInput: true },
        'ui:errorMessages': {
          maxLength: 'Please enter a name with fewer than 100 characters.',
          pattern: 'Please enter a valid name.',
        },
      },
    ),
    [formFields.query]: {
      'ui:title': 'Please enter your question or message below',
      'ui:widget': 'textarea',
      'ui:validations': [validateWhiteSpace],
    },
  },
  schema: {
    type: 'object',
    required: [formFields.inquiryType, formFields.topic, formFields.query],
    properties: {
      [formFields.topic]: topic,
      [formFields.inquiryType]: inquiryType,
      [formFields.query]: query,
    },
  },
};

export default inquiryPage;
