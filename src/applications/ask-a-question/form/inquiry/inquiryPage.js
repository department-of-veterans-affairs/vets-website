import { validateWhiteSpace } from 'platform/forms/validations';
import * as topic from './topic/topic';

import fullSchema from '../0873-schema.json';
import {
  inquiryPageDescription,
  inquiryTypeTitle,
  queryTitle,
} from '../../constants/labels';

const { inquiryType, query } = fullSchema.properties;

const formFields = {
  topic: 'topic',
  inquiryType: 'inquiryType',
  query: 'query',
};

const inquiryPage = {
  uiSchema: {
    'ui:description': inquiryPageDescription,
    [formFields.inquiryType]: {
      'ui:title': inquiryTypeTitle,
    },
    [formFields.topic]: topic.uiSchema(),
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
      [formFields.topic]: topic.schema(fullSchema),
      [formFields.inquiryType]: inquiryType,
      [formFields.query]: query,
    },
  },
};

export default inquiryPage;
