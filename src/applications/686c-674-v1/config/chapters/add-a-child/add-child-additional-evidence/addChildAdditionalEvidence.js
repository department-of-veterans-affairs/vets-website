import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import { addChild } from '../../../utilities';
import { childStatusDescription } from '../child-place-of-birth/childStatusDescription';
import { AdditionalEvidence } from '../../../../components/AdditionalEvidence';

export const schema = addChild.properties.childAdditionalEvidence;

export const uiSchema = {
  'ui:title': 'Additional evidence needed to add child',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(childStatusDescription),
  },
  childEvidenceDocumentType: {
    'ui:title': 'Type of evidence',
    'ui:options': {
      hideOnReview: true,
    },
  },
  childSupportingDocuments: fileUploadUI('Additional Evidence needed', {
    buttonText: 'Upload supporting documents',
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    showFieldLabel: false,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  }),
};
