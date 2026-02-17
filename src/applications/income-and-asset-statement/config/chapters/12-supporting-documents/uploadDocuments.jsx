import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { showUpdatedContent } from '../../../helpers';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

const Description = (
  <>
    <p>
      You can submit your supporting documents using any of the options listed
      on this page.
    </p>
    <p>Guidelines to upload a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, or .png file.</li>
      <li>Your file should be no larger than 20MB</li>
    </ul>
  </>
);

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can choose to submit your supporting documents
    and additional evidence after submitting this form. You’ll need to submit
    them by mail or upload them using the Claim Status Tool.
  </p>
);

export default {
  title: 'Upload documents',
  path: 'additional-information/upload-documents',
  depends: () => !showUpdatedContent(),
  uiSchema: {
    ...titleUI('Upload supporting documents'),
    'ui:description': Description,
    files: {
      ...fileUploadUI('', {
        buttonText: 'Upload supporting document',
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        maxSize: MAX_FILE_SIZE_BYTES,
        fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        fileUploadNetworkErrorMessage:
          'We’re sorry. There was problem with our system and we couldn’t upload your file. You can try again later.',
        fileUploadNetworkErrorAlert: {
          header: 'We couldn’t upload your file',
          body: [
            'We’re sorry. There was a problem with our system and we couldn’t upload your file. Try uploading your file again.',
            'Or select Continue to fill out the rest of your form. And then follow the instructions at the end to learn how to submit your documents.',
          ],
        },
        hideLabelText: true,
      }),
      'ui:confirmationField': ({ formData }) => ({
        data: formData?.map(item => item.name || item.fileName),
        label: 'Supporting documents',
      }),
    },
    'view:uploadMessage': {
      'ui:description': UploadMessage,
    },
  },
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            size: {
              type: 'integer',
            },
            confirmationCode: {
              type: 'string',
            },
          },
        },
      },
      'view:uploadMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};
