// @ts-check
import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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
    'ui:confirmationField': ({ formData }) => {
      return !formData ||
        !formData.supportingEvidence ||
        !Array.isArray(formData.supportingEvidence) ||
        formData.supportingEvidence.length === 0 ? (
        <li>No evidence was uploaded</li>
      ) : (
        <li>
          <div className="vads-u-color--gray">Supporting evidence uploaded</div>
          {formData.supportingEvidence.map(file => (
            <ul key={file.name}>
              <li>{file.name}</li>
              <li>{file.size}B</li>
              <li>{file.type}</li>
            </ul>
          ))}
        </li>
      );
    },
    supportingEvidence: fileInputMultipleUI({
      title: 'Upload your supporting evidence',
      required: false,
      accept: '.pdf,.jpeg,.jpg,.png',
      hint:
        'You can upload a .pdf, .jpeg, or .png file. Your files must not be larger than 25MB',
      disallowEncryptedPdfs: true,
      maxFileSize: 26214400, // 25MB in bytes
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
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
