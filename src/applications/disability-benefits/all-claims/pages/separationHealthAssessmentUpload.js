import React from 'react';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../components/fileInputComponent/constants';
import { createPayload } from '../utils/fileInputComponent/fileInputMultiUIConfig';
import { additionalInfo } from '../components/fileInputComponent/AdditionalUploadInfo';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PDF_FILE_SIZE_BYTES,
  MAX_PDF_FILE_SIZE_MB,
} from '../constants';

const SHA_ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';
const SHA_ATTACHMENT_ID = 'L702';
const SHA_HINT_TEXT = `You can upload .pdf, .jpg, .jpeg, or .png files. Each file should be no larger than ${MAX_FILE_SIZE_MB} MB for non-PDF files or ${MAX_PDF_FILE_SIZE_MB} MB for PDF files. Larger files may take longer to upload, depending on the internet connection.`;

const parseShaResponse = (response, file) => ({
  name: file?.name,
  confirmationCode: response?.data?.attributes?.guid,
  attachmentId: SHA_ATTACHMENT_ID,
  file,
});

export const uiSchema = {
  'ui:title': 'Upload your Separation Health Assessment Part A',
  'ui:description': (
    <>
      <p>
        Upload your Separation Health Assessment Part A to support your claim.
      </p>
      {additionalInfo}
    </>
  ),
  separationHealthAssessmentUploads: {
    ...fileInputMultipleUI({
      title: FILE_UPLOAD_TITLE,
      required: true,
      skipUpload: false,
      fileUploadUrl: UPLOAD_URL,
      formNumber: '21-526EZ',
      fileSizesByFileType: {
        pdf: {
          maxFileSize: MAX_PDF_FILE_SIZE_BYTES,
          minFileSize: 1024,
        },
        default: {
          maxFileSize: MAX_FILE_SIZE_BYTES,
          minFileSize: 1,
        },
      },
      accept: SHA_ACCEPTED_FILE_TYPES,
      hint: SHA_HINT_TEXT,
      createPayload,
      parseResponse: parseShaResponse,
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['separationHealthAssessmentUploads'],
  properties: {
    separationHealthAssessmentUploads: {
      ...fileInputMultipleSchema(),
      maxItems: 20,
    },
  },
};
