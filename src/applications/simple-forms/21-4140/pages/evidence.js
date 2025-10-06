// @ts-check
import React from 'react';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default {
  uiSchema: {
    ...titleUI({
      title: 'Upload your supporting evidence',
      description: (
        <div>
          <p>
            If you want to submit documents that explain your income, upload
            them here.
          </p>
          <p>
            Depending on your income source, you can upload these types of
            documents:
          </p>
          <ul>
            <li>
              <strong>
                If your income was from your spouse and taxes were filed jointly
              </strong>
              , documentation of the income source, such as a spouse's W-2 or
              wage and tax statement
            </li>
            <li>
              <strong>If you're no longer employed</strong>, upload evidence of
              when you stopped working, such as a statement from your former
              employer with the last day you worked
            </li>
            <li>
              <strong>
                If you're currently employed but haven't worked for a continuous
                year
              </strong>
              , upload evidence of your employment status, such as a statement
              from your employer with the dates you worked
            </li>
          </ul>
          <p>
            You'll need to scan your document onto the device you're using to
            submit this application, such as your computer, tablet, or mobile
            phone. You can upload your file from there.
          </p>

          <VaAdditionalInfo trigger="Document upload instructions">
            <ul>
              <li>You can upload a .pdf, .jpeg, or .png file</li>
              <li>Maximum file size: 25MB</li>
            </ul>
          </VaAdditionalInfo>

          <p>
            <em>
              A 1MB file equals about 500 pages of text. A photo is usually
              about 6MB. Large files can take longer to upload with a slow
              internet connection.
            </em>
          </p>
        </div>
      ),
    }),
    supportingEvidence: fileInputMultipleUI({
      title: 'Upload your supporting evidence',
      required: false,
      accept: '.pdf,.jpeg,.jpg,.png',
      maxFileSize: 26214400, // 25MB in bytes
      skipUpload: true, // Set to true for development - will need backend implementation
      formNumber: '21-4140',
      errorMessages: {
        required: 'Please select a file to upload',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingEvidence: fileInputMultipleSchema(),
    },
  },
};
