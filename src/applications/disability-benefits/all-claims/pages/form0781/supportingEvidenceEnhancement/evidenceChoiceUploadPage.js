import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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

export const migrateEvidenceChoiceUploadFormData = formData => {
  const existingFiles = formData?.evidenceChoiceFileInput;
  if (!Array.isArray(existingFiles) || existingFiles.length === 0) {
    return formData;
  }

  let didChange = false;
  const migratedFiles = existingFiles.map(file => {
    if (!file) {
      return file;
    }

    if (!file.confirmationCode && file.guid) {
      didChange = true;
      return {
        ...file,
        confirmationCode: file.guid,
      };
    }

    return file;
  });

  if (!didChange) {
    return formData;
  }

  return {
    ...formData,
    evidenceChoiceFileInput: migratedFiles,
  };
};

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
      // Disallow uploads greater than 100 MB
      maxFileSize: 104857600, // 100MB in bytes
      minSize: 1024,
      accept: FILE_TYPES,
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
      parseResponse: (response, file) => {
        // VaFileInputMultipleField expects `parseResponse` to include the original
        // File object under `file` so it can derive name/size/type.
        return {
          confirmationCode: response?.data?.attributes?.guid,
          file,
        };
      },
      additionalInputRequired: true,
      additionalInput: additionalFormInputsContent,
      additionalInputUpdate: (instance, error, data) => {
        if (!instance) return;

        const inputEl = instance;

        // The slotted `va-select` can exist before it's fully hydrated.
        // Setting `value` too early can crash inside the web component.
        inputEl.setAttribute('error', error);

        const documentType = data?.documentType;
        if (!documentType) return;

        const setDocumentType = () => {
          try {
            inputEl.value = documentType;
          } catch (e) {
            // ignore
          }

          try {
            inputEl.setAttribute('value', documentType);
          } catch (e) {
            // ignore
          }
        };

        if (typeof inputEl.componentOnReady === 'function') {
          inputEl.componentOnReady().then(setDocumentType);
        } else {
          setTimeout(setDocumentType, 0);
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
