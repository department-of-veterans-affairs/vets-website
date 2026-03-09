import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  FILE_TYPES,
  HINT_TEXT,
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../components/fileInputComponent/constants';
import {
  createPayload,
  parseResponse,
} from '../utils/fileInputComponent/fileInputMultiUIConfig';

export const uiSchema = {
  separationHealthAssessmentUploads: {
    ...fileInputMultipleUI({
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
      createPayload,
      parseResponse,
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['separationHealthAssessmentUploads'],
  properties: {
    separationHealthAssessmentUploads: fileInputMultipleSchema(),
  },
};
