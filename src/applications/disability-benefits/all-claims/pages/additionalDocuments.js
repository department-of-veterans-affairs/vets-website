// import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

// import { UploadDescription } from '../content/fileUploadDescriptions';
// import { ancillaryFormUploadUi } from '../utils/schemas';
// import { selfAssessmentAlert } from '../content/selfAssessmentAlert';
// import { isBDD } from '../utils';
import { evidenceChoiceUploadContent } from './form0781/supportingEvidenceEnhancement/evidenceChoiceUploadPage';
import { standardTitle } from '../content/form0781';
import UploadFiles from '../components/supportingEvidenceUpload/uploadFiles';

// const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  // 'view:selfAssessmentAlert': {
  //   'ui:title': selfAssessmentAlert,
  //   'ui:options': {
  //     hideIf: formData => !isBDD(formData),
  //   },
  // },
  // additionalDocuments: {
  //   ...ancillaryFormUploadUi(
  //     'Supporting (lay) statements or other evidence',
  //     'Adding additional evidence:',
  //     {
  //       addAnotherLabel: 'Add another file',
  //       buttonText: 'Upload file',
  //     },
  //   ),
  //   'ui:description': UploadDescription,
  //   'ui:confirmationField': ({ formData }) => ({
  //     data: formData?.map(item => item.name || item.fileName),
  //     label: 'Uploaded file(s)',
  //   }),
  // },
  'view:evidenceChoiceUpload': {
    'ui:title': standardTitle(
      'Upload supporting documents and additional forms',
    ),
    'ui:description': evidenceChoiceUploadContent,
  },
  uploadedFiles: {
    'ui:title': ' ',
    'ui:field': UploadFiles,
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please upload at least one supporting document',
    },
  },
};

export const schema = {
  type: 'object',
  required: ['uploadedFiles'],
  properties: {
    'view:evidenceChoiceUpload': {
      type: 'object',
      properties: {},
    },
    // additionalDocuments: attachments,
    // 'view:evidenceChoiceUpload': {
    //   type: 'object',
    //   properties: {},
    // },
    uploadedFiles: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
