import React from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import DualFileUploadField from '../../../components/DualFileUploadField';

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can submit your supporting documents and
    additional evidence after submitting your application. You’ll need to submit
    them by mail or upload them using the Claim Status Tool.
  </p>
);

const filesUi = fileInputMultipleUI({
  title: 'Select a file to upload',
  hint:
    'You can upload a .pdf, .jpg, or .jpeg file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).',
  required: false,
  fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
  maxFileSize: 103809024, // 99 MB for PDFs
  accept: '.pdf,.jpg,.jpeg',
  formNumber: '21P-534EZ',
});

/**
 * Blocks the Continue button while CAVE is still processing uploaded documents.
 * Rendered as a hidden `view:caveProcessing` field so ui:validations can gate
 * form navigation without displaying anything when processing is complete.
 */
const CaveProcessingField = () => {
  const formData = useSelector(getFormData) || {};
  const isProcessing = (formData.files ?? []).some(
    f => f.idpUploadStatus === 'pending' || f.idpUploadStatus === 'processing',
  );

  if (!isProcessing) return null;

  return (
    <>
      <va-loading-indicator
        label="Processing your documents"
        message="We're extracting information from your documents. This may take a few minutes. Once processing is complete, you'll be able to continue."
        set-focus
      />
    </>
  );
};

export default {
  uiSchema: {
    ...titleUI(
      'Submit your supporting documents',
      'You can submit your supporting documents and additional evidence with your application.',
    ),
    files: {
      ...filesUi,
      'ui:webComponentField': DualFileUploadField,
    },
    'view:uploadMessage': {
      'ui:description': UploadMessage,
    },
    'view:caveProcessing': {
      'ui:field': CaveProcessingField,
      'ui:validations': [
        (_errors, _fieldValue, formData) => {
          const processing = (formData?.files ?? []).some(
            f =>
              f.idpUploadStatus === 'pending' ||
              f.idpUploadStatus === 'processing',
          );
          if (processing) _errors.addError('Documents are still processing.');
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      files: fileInputMultipleSchema(),
      'view:uploadMessage': {
        type: 'object',
        properties: {},
      },
      'view:caveProcessing': {
        type: 'object',
        properties: {},
      },
    },
  },
};
