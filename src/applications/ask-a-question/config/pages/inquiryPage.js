import { uiSchema as autoSuggestUiSchema } from 'platform/forms-system/src/js/definitions/autosuggest';
import fullSchema from '../../0873-schema.json';
import { validateWhiteSpace } from 'platform/forms/validations';

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
    [formFields.inquiryType]: autoSuggestUiSchema(
      'Type of inquiry',
      getOptions(inquiryType.enum),
      {
        'ui:options': { queryForResults: true, freeInput: true },
        'ui:errorMessages': {
          maxLength: 'Please enter a name with fewer than 100 characters.',
          pattern: 'Please enter a valid name.',
        },
      },
    ),
    [formFields.topic]: autoSuggestUiSchema('Topic', getOptions(topic.enum), {
      'ui:options': { queryForResults: true, freeInput: true },
      'ui:errorMessages': {
        maxLength: 'Please enter a name with fewer than 100 characters.',
        pattern: 'Please enter a valid name.',
      },
    }),
    [formFields.query]: {
      'ui:title': 'Enter your message here',
      'ui:widget': 'textarea',
      'ui:validations': [validateWhiteSpace],
    },
  },
  schema: {
    type: 'object',
    required: [formFields.inquiryType, formFields.topic, formFields.query],
    properties: {
      [formFields.inquiryType]: inquiryType,
      [formFields.topic]: topic,
      [formFields.query]: query,
    },
  },
};

export default inquiryPage;
