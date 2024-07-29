import {
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { UPLOAD_GUIDELINES } from '../config/constants';
import { getFormContent } from '../helpers';

const { formNumber, title } = getFormContent();

export const uploadPage = {
  uiSchema: {
    'view:uploadGuidelines': {
      'ui:description': UPLOAD_GUIDELINES,
    },
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/scanned_form_upload`,
        title,
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:uploadGuidelines': {
        type: 'object',
        properties: {},
      },
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};
