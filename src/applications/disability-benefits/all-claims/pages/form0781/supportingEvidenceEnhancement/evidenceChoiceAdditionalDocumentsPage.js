import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  standardTitle,
  mentalHealthSupportAlert,
} from '../../../content/form0781';
import { additionalSupportAccordion } from '../../../content/supportingEvidenceOrientation';
import {
  evidenceChoiceAdditionalDocumentsTitle,
  evidenceChoiceAdditionalDocuments,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPage';
import {
  FILE_TYPES,
  HINT_TEXT,
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../../../components/fileInputComponent/constants';
import {
  createPayload,
  parseResponse,
  handleAdditionalInput,
  additionalInputUpdate,
} from '../../../utils/fileInputComponent/fileInputMultiUIConfig';
import { additionalInput } from '../../../components/fileInputComponent/AdditionalUploadInput';
import { UploadDescription } from '../../../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../../../utils/schemas';

const uploadFileInputV3 = fileInputMultipleUI({
  title: FILE_UPLOAD_TITLE,
  required: false, // TODO: set required to true once V1 is deprecated
  skipUpload: false,
  fileUploadUrl: UPLOAD_URL,
  formNumber: '21-526EZ',
  fileSizesByFileType: {
    pdf: {
      maxFileSize: 1024 * 1024 * 100,
      minFileSize: 1024,
    },
    default: {
      maxFileSize: 1024 * 1024 * 50,
      minFileSize: 1,
    },
  },
  accept: FILE_TYPES,
  hint: HINT_TEXT,
  errorMessages: {
    additionalInput: 'Choose a document type',
  },
  createPayload,
  parseResponse,
  additionalInputRequired: true,
  additionalInput,
  handleAdditionalInput,
  additionalInputUpdate,
  'ui:options': {
    hideIf: formData =>
      get('disability526SupportingEvidenceFileInputV3', formData) === false,
  },
});

const { attachments } = full526EZSchema.properties;
const uploadFileInputV1 = {
  ...ancillaryFormUploadUi('', 'Adding additional evidence:', {
    addAnotherLabel: 'Add another file',
    buttonText: 'Upload file',
  }),
  'ui:description': UploadDescription,
  'ui:confirmationField': ({ formData }) => ({
    data: formData?.map(item => item.name || item.fileName),
    label: 'Uploaded file(s)',
  }),
};

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceAdditionalDocumentsTitle),
  'ui:description': evidenceChoiceAdditionalDocuments,
  additionalDocumentsV3: {
    ...uploadFileInputV3,
    'ui:options': {
      ...uploadFileInputV3['ui:options'],
      hideIf: formData =>
        get('disability526SupportingEvidenceFileInputV3', formData) === false,
    },
  },
  additionalDocumentsV1: {
    ...uploadFileInputV1,
    'ui:options': {
      ...uploadFileInputV1['ui:options'],
      hideIf: formData =>
        get('disability526SupportingEvidenceFileInputV3', formData) === true,
    },
  },
  'view:additionalSupportAccordionEvidenceChoiceAdditionalDocuments': {
    'ui:description': additionalSupportAccordion,
  },
  'view:mentalHealthSupportAlertEvidenceChoiceAdditionalDocuments': {
    'ui:description': mentalHealthSupportAlert,
  },
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      // When V1 is visible (toggle is false), require at least 1 file
      if (
        get('disability526SupportingEvidenceFileInputV3', formData) === false
      ) {
        // fix to remove the V3 schema as it was causing veterans to be blocked when clicking 'continue'.
        // TODO: remove comment below once V1 is deprecated
        // eslint-disable-next-line no-unused-vars
        const { additionalDocumentsV3, ...rest } = formSchema.properties;
        return {
          ...formSchema,
          required: ['additionalDocumentsV1'],
          properties: rest,
        };
      }
      return { ...formSchema, required: ['additionalDocumentsV3'] };
    },
  },
};

export const schema = {
  type: 'object',
  // required: ['additionalDocuments'] // TODO: add required back in when V1 component is no longer required
  properties: {
    // TODO: Update to utilize only `additionalDocuments` after removing V1
    additionalDocumentsV3: fileInputMultipleSchema(),
    additionalDocumentsV1: attachments,
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
