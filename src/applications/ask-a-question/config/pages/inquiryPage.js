import { uiSchema as autoSuggestUiSchema } from 'platform/forms-system/src/js/definitions/autosuggest';
import { validateWhiteSpace } from 'platform/forms/validations';

import fullSchema from '../../0873-schema.json';
import reviewField from '../../content/inquiryPage';
import {
  inquiryPageDescription,
  inquiryTypeTitle,
  queryTitle,
  topicDescription,
  topicErrorMessage,
  topicTitle,
} from '../../content/labels';

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
  ...autoSuggestUiSchema(topicTitle, getOptions(topic.enum), {
    'ui:options': { queryForResults: true, freeInput: true },
    'ui:errorMessages': {
      pattern: topicErrorMessage,
    },
  }),
  'ui:description': topicDescription,
  'ui:reviewField': reviewField,
};

const inquiryPage = {
  uiSchema: {
    'ui:description': inquiryPageDescription,
    [formFields.inquiryType]: {
      'ui:title': inquiryTypeTitle,
    },
    [formFields.topic]: topicUiSchema,
    [formFields.query]: {
      'ui:title': queryTitle,
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
