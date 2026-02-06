import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const SEPARATION_HEALTH_ASSESSMENT_DESCRIPTION = Object.freeze(
  <p>
    Upload your completed Separation Health Assessment Part A. This document is
    provided to you during your separation physical examination.
  </p>,
);

export const uiSchema = {
  ...titleUI('Upload Separation Health Assessment Part A'),
  ...descriptionUI(SEPARATION_HEALTH_ASSESSMENT_DESCRIPTION),
  separationHealthAssessmentUpload: {
    ...fileInputUI({
      errorMessages: {
        required: 'Upload your Separation Health Assessment Part A',
      },
      name: 'separation-health-assessment-upload',
      fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
      title: 'Upload Separation Health Assessment Part A',
      hint:
        'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
      required: formData =>
        formData['526ez_required_sha_for_bdd_enabled'] || false,
      maxFileSize: MAX_FILE_SIZE,
      disallowEncryptedPdfs: true,
      createPayload: (file, _formId, password) => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);
        if (password) {
          payload.append('supporting_evidence_attachment[password]', password);
        }
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        attachmentId: 'L450', // Using same attachment type as STR
      }),
      confirmationField: ({ formData }) => ({
        data: formData?.name,
        label: 'File you uploaded',
      }),
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    separationHealthAssessmentUpload: fileInputSchema(),
  },
  required: ['separationHealthAssessmentUpload'],
};
