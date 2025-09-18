import React from 'react';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const additionalInfoContent = (
  <va-additional-info trigger="What kind of evidence can I submit?">
    <ul>
      <li>
        Spousal income and taxes were filed jointly, submit documentation of the
        income source such as a spouse’s <strong>Form W-2</strong>,{' '}
        <strong>Wage and Tax Statement</strong>
      </li>
      <li>
        If you are no longer employed, submit evidence documenting the cessation
        of employment such as a statement from the former employer providing the
        date of termination.
      </li>
      <li>
        If you are currently employed, but employment has not been for a
        continuous year, submit evidence explaining employment status such as a
        statement from the employer stating the dates employed.
      </li>
    </ul>
  </va-additional-info>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Upload evidence in support of your unemployability.',
      <div>
        <p>
          If you have documents you would like to submit as evidence of
          unemployability, upload them here.
        </p>
        <p>
          You'll need to scan your document onto the device you're using to
          submit this application, such as your computer, tablet, or mobile
          phone. You can upload your file from there.
        </p>
        <p>
          <strong>Guidelines for uploading a file:</strong>
        </p>
        <ul>
          <li>You can upload a .pdf, .jpeg, or .png file</li>
          <li>Your file should be no larger than 25MB</li>
        </ul>
        {additionalInfoContent}
      </div>,
    ),
    documents: fileInputUI({
      title: 'Upload your documents',
      hint: 'Upload PDF, JPG, or PNG files (25MB max each)',
      buttonText: 'Choose files to upload',
      accept: '.pdf,.jpg,.jpeg,.png',
      maxSize: 26214400, // 25MB in bytes
      maxFiles: 10,
      required: false, // This field is optional
      additionalErrorMessage: 'Please check file size and format requirements',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      documents: fileInputSchema(),
    },
  },
};
