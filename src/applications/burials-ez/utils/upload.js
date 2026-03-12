import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { fileInputMultipleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import {
  FILE_UPLOAD_URL,
  FORM_NUMBER,
  MAX_FILE_SIZE_LABEL,
  MAX_FILE_SIZE_BYTES,
} from './constants';

export const burialUploadUI = ({ title, required = true, ...options }) => {
  if (!title) {
    throw new Error('burialUploadUI requires a title');
  }

  return {
    ...fileInputMultipleUI({
      title,
      hint: `You can upload a .jpg, .pdf, or .png file. Be sure that your file size is ${MAX_FILE_SIZE_LABEL} or less.`,
      fileUploadUrl: FILE_UPLOAD_URL,
      accept: '.pdf,.jpeg,.jpg,.png',
      required,
      maxFileSize: MAX_FILE_SIZE_BYTES,
      formNumber: FORM_NUMBER,
      skipUpload: environment.isLocalhost(),
      // server response triggers required validation.
      // skipUpload needed to bypass in local environment
    }),
    ...options,
  };
};
