// import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

// import { UploadDescription } from '../content/fileUploadDescriptions';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { ancillaryFormUploadUi } from '../utils/schemas';
// import { selfAssessmentAlert } from '../content/selfAssessmentAlert';
// import { isBDD } from '../utils';
import {
  evidenceChoiceUploadContent,
  evidenceChoiceTitle,
} from './evidenceChoiceUpload';
import { standardTitle } from '../../../content/form0781';
import {
  FILE_TYPES,
  HINT_TEXT,
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../../../components/supportingEvidenceUpload/constants';
import { additionalFormInputsContent } from '../../../components/supportingEvidenceUpload/uploadFiles';

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceTitle),
  'ui:description': evidenceChoiceUploadContent,
  evidenceChoiceFileInput: {
    ...fileInputMultipleUI({
      title: FILE_UPLOAD_TITLE,
      required: true,
      skipUpload: false,
      fileUploadUrl: UPLOAD_URL,
      formNumber: '21-526EZ',
      // fileUploadUrl: `${baseURL}/upload_supporting_documents`,
      // Disallow uploads greater than 100 MB
      maxFileSize: 104857600 / 2, // 100MB in bytes
      accept: FILE_TYPES,
      // errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
      hint: HINT_TEXT,
      errorMessages: {
        additionalInput: 'Choose a document type',
      },
      createPayload: (file, _formId, password) => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);
        if (password) {
          payload.append('supporting_evidence_attachment[password]', password);
        }
        return payload;
      },
      additionalInputRequired: true,
      additionalInput: additionalFormInputsContent,
      additionalInputUpdate: (instance, error, data) => {
        instance.setAttribute('error', error);
        if (data) {
          instance.setAttribute('value', data.documentType);
        }
      },
      handleAdditionalInput: e => {
        const { value } = e.detail;
        if (value === '') return null;
        return { documentType: e.detail.value };
      },
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['evidenceChoiceFileInput'],
  properties: {
    evidenceChoiceFileInput: fileInputMultipleSchema(),
  },
};
