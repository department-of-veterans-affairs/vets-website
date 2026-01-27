import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { standardTitle } from '../../../content/form0781';
import {
  evidenceChoiceAdditionalDocumentsTitle,
  evidenceChoiceAdditionalDocumentsContent,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPage';
import { ancillaryFormUploadUi } from '../../../utils/schemas';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceAdditionalDocumentsTitle),
  evidenceChoiceAdditionalDocuments: {
    ...ancillaryFormUploadUi('', 'Adding additional evidence:', {
      addAnotherLabel: 'Add another file',
      buttonText: 'Upload file',
    }),
    'ui:description': evidenceChoiceAdditionalDocumentsContent,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['evidenceChoiceAdditionalDocuments'],
  properties: {
    evidenceChoiceAdditionalDocuments: attachments,
  },
};
