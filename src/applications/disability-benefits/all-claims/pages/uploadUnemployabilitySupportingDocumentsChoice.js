import { uploadDescription } from '../content/uploadUnemployabilitySupportingDocuments';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
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
