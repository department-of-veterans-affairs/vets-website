import { uploadDescription } from '../content/uploadUnemployabilitySupportingDocuments';

export const uiSchema = {
  'ui:title': 'Supporting Documents',
  'ui:description': uploadDescription,
  'view:uploadUnemployabilitySupportingDocumentsChoice': {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadUnemployabilitySupportingDocumentsChoice': {
      type: 'boolean',
      properties: {},
    },
  },
};
