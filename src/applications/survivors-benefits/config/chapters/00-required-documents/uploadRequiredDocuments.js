import React, { useEffect } from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DualFileUploadField from '../../../components/DualFileUploadField';

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
 * Shows a va-alert banner when the user tries to continue without uploading
 * any documents. Once the banner has been shown once (warningShown flag set),
 * subsequent attempts are not blocked; the banner stays visible but navigation
 * is allowed.
 */
const NoUploadWarningField = ({ formContext, formData, onChange }) => {
  const globalFormData = useSelector(getFormData) || {};
  const hasFiles = (globalFormData.files ?? []).length > 0;
  const showWarning = formContext?.submitted && !hasFiles;

  useEffect(
    () => {
      if (showWarning && !formData?.warningShown) {
        onChange({ warningShown: true });
      }
    },
    [showWarning], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!showWarning && !formData?.warningShown) return null;
  if (hasFiles) return null;

  return (
    <VaAlert status="warning" visible slim className="vads-u-margin-top--4">
      <p>
        Attach the Veteran’s DD214 and death certificate. <br />
        Uploading these documents now will help us process your claim faster.
      </p>
    </VaAlert>
  );
};

export default {
  uiSchema: {
    ...titleUI(
      "Submit Veteran's DD214 and death certificate",
      "If you upload these documents now, our system will process them while you finish the form. You'll be able to check the details at the end.",
    ),
    'view:noUploadWarning': {
      'ui:field': NoUploadWarningField,
      'ui:validations': [
        (errors, fieldValue, formData) => {
          // Only block on the very first attempt. Once warningShown is set,
          // the user has seen the banner and can proceed without uploading.
          const hasFiles = (formData?.files ?? []).length > 0;
          if (!hasFiles && !fieldValue?.warningShown) {
            errors.addError('Please upload at least one document to continue.');
          }
        },
      ],
    },
    files: {
      ...filesUi,
      'ui:webComponentField': DualFileUploadField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      files: fileInputMultipleSchema(),
      'view:noUploadWarning': {
        type: 'object',
        properties: {},
      },
    },
  },
};
