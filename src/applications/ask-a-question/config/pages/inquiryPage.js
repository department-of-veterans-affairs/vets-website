import { uiSchema as autoSuggestUiSchema } from 'platform/forms-system/src/js/definitions/autosuggest';
import { validateWhiteSpace } from 'platform/forms/validations';

import fullSchema from '../../0873-schema.json';
import pageDescription from '../../content/PageDescription';
import reviewField from '../../content/inquiryPage';

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

const topicUiSchema = {
  ...autoSuggestUiSchema(
    'Which topic best describes your question or message?',
    getOptions(topic.enum),
    {
      'ui:options': { queryForResults: true, freeInput: true },
      'ui:errorMessages': {
        pattern: 'Please enter a valid topic.',
      },
    },
  ),
  'ui:description':
    'Please start typing below. If you do not find a match, type space to see all possible categories',
  'ui:reviewField': reviewField,
};

const inquiryPage = {
  uiSchema: {
    'ui:description': pageDescription('Your message'),
    [formFields.inquiryType]: {
      'ui:title': "Tell us the reason you're contacting us",
    },
    [formFields.topic]: topicUiSchema,
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
