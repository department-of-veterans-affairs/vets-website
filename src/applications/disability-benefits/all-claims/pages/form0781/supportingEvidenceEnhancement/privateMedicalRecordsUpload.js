import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { standardTitle } from '../../../content/form0781';
import {
  pmrTitle,
  pmrDescription,
} from '../../../content/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';
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
import { additionalInput } from '../../../components/fileInputComponent/PMRAdditionalUploadInput';
import { UploadDescription } from '../../../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../../../utils/schemas';

const uploadFileInputV3 = fileInputMultipleUI({
  title: FILE_UPLOAD_TITLE,
  required: true,
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
});

const { privateMedicalRecordAttachments } = full526EZSchema.properties;
const uploadFileInputV1 = ancillaryFormUploadUi(
  'Upload your private medical records',
  ' ',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another file',
    buttonText: 'Upload file',
  },
);

export const uiSchema = {
  'ui:title': standardTitle(pmrTitle),
  'ui:description': pmrDescription,
  privateMedicalRecordAttachmentsV3: {
    ...uploadFileInputV3,
    'ui:options': {
      ...uploadFileInputV3['ui:options'],
      hideIf: formData =>
        get('disability526SupportingEvidenceFileInputV3', formData) === false,
    },
  },
  privateMedicalRecordAttachmentsV1: {
    ...uploadFileInputV1,
    'ui:options': {
      ...uploadFileInputV1['ui:options'],
      hideIf: formData =>
        get('disability526SupportingEvidenceFileInputV3', formData) === true,
    },
    'ui:description': UploadDescription,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Private medical records',
    }),
    // 'ui:required': data =>
    //   get(DATA_PATHS.hasPrivateRecordsToUpload, data, false),
  },
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      // When V1 is visible (toggle is false), require at least 1 file
      if (
        get('disability526SupportingEvidenceFileInputV3', formData) === false
      ) {
        // fix to remove the V3 schema as it was causing veterans to be blocked when clicking 'continue'.
        // TODO: remove comment below once V1 is deprecated
        const {
          // eslint-disable-next-line no-unused-vars
          privateMedicalRecordAttachmentsV3,
          ...rest
        } = formSchema.properties;
        return {
          ...formSchema,
          required: ['privateMedicalRecordAttachmentsV1'],
          properties: rest,
        };
      }
      return { ...formSchema, required: ['privateMedicalRecordAttachmentsV3'] };
    },
  },
};

export const schema = {
  type: 'object',
  // required: ['privateMedicalRecordAttachments'],
  properties: {
    privateMedicalRecordAttachmentsV3: fileInputMultipleSchema(),
    privateMedicalRecordAttachmentsV1: privateMedicalRecordAttachments,
  },
};
