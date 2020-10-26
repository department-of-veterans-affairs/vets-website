import { validateWhiteSpace } from 'platform/forms/validations';
import * as topic from './topic/topic';
import { veteranStatusUI } from './status/veteranStatusUI';

import fullSchema from '../0873-schema.json';
import {
  inquiryPageDescription,
  inquiryTypeTitle,
  queryTitle,
} from '../../constants/labels';

const { inquiryType, query, veteranStatus } = fullSchema.properties;

const formFields = {
  topic: 'topic',
  inquiryType: 'inquiryType',
  query: 'query',
  veteranStatus: 'veteranStatus',
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
    [formFields.veteranStatus]: {
      ...veteranStatusUI,
    },
  },
  schema: {
    type: 'object',
    required: [formFields.inquiryType, formFields.topic, formFields.query],
    properties: {
      [formFields.topic]: topic.schema(fullSchema),
      [formFields.inquiryType]: inquiryType,
      [formFields.query]: query,
      [formFields.veteranStatus]: veteranStatus,
    },
  },
};

export default inquiryPage;
