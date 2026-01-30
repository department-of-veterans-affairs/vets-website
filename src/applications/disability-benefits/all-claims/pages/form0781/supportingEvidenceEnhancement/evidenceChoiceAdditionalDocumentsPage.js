import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import {
  standardTitle,
  mentalHealthSupportAlert,
} from '../../../content/form0781';
import { additionalSupportAccordion } from '../../../content/supportingEvidenceOrientation';
import {
  evidenceChoiceAdditionalDocumentsTitle,
  evidenceChoiceAdditionalDocumentsContent,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPage';
import { ancillaryFormUploadUi } from '../../../utils/schemas';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceAdditionalDocumentsTitle),
  'ui:order': [
    'evidenceChoiceAdditionalDocuments',
    'view:additionalSupportAccordionEvidenceChoiceAdditionalDocuments',
    'view:mentalHealthSupportAlertEvidenceChoiceAdditionalDocuments',
  ],
  evidenceChoiceAdditionalDocuments: {
    ...ancillaryFormUploadUi('', 'Selected files', {
      addAnotherLabel: 'Add another file',
      buttonText: 'Upload file',
      customClasses:
        'schemaform-file-upload evidence-choice-additional-documents-upload',
    }),
    'ui:description': evidenceChoiceAdditionalDocumentsContent,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
  },
  'view:additionalSupportAccordionEvidenceChoiceAdditionalDocuments': {
    'ui:description': additionalSupportAccordion,
  },
  'view:mentalHealthSupportAlertEvidenceChoiceAdditionalDocuments': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  required: ['evidenceChoiceAdditionalDocuments'],
  properties: {
    evidenceChoiceAdditionalDocuments: attachments,
    'view:additionalSupportAccordionEvidenceChoiceAdditionalDocuments': {
      type: 'object',
      properties: {},
    },
    'view:mentalHealthSupportAlertEvidenceChoiceAdditionalDocuments': {
      type: 'object',
      properties: {},
    },
  },
};
