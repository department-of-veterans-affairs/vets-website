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

const SHA_ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';
const SHA_ATTACHMENT_ID = 'L702';
const SHA_HINT_TEXT =
  'You can upload .pdf, .jpg, .jpeg, or .png files. Each file should be no larger than 50 MB for non-PDF files or 99 MB for PDF files. Larger files may take longer to upload, depending on the internet connection.';

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
          maxFileSize: 1024 * 1024 * 100,
          minFileSize: 1024,
        },
        default: {
          maxFileSize: 1024 * 1024 * 50,
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
