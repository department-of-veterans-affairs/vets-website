import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  standardTitle,
  mentalHealthSupportAlert,
} from '../../../content/form0781';
import { additionalSupportAccordion } from '../../../content/supportingEvidenceOrientation';
import {
  evidenceChoiceAdditionalDocumentsTitle,
  evidenceChoiceAdditionalDocuments,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPage';
import { uiSchema as legacyUiSchema } from '../../additionalDocuments';

const { attachments } = fullSchema.properties;

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceAdditionalDocumentsTitle),
  'ui:description': evidenceChoiceAdditionalDocuments,
  'ui:order': [
    'additionalDocuments',
    'view:additionalSupportAccordionV1',
    'view:mentalHealthSupportAlertV1',
  ],
  additionalDocuments: legacyUiSchema.additionalDocuments,
  'view:additionalSupportAccordionV1': {
    'ui:description': additionalSupportAccordion,
  },
  'view:mentalHealthSupportAlertV1': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments,
    'view:additionalSupportAccordionV1': { type: 'object', properties: {} },
    'view:mentalHealthSupportAlertV1': { type: 'object', properties: {} },
  },
};
