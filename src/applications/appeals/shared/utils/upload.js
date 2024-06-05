import React from 'react';

import { focusFileCard } from './focus';

// Backend using Lighthouse's /uploads/validate_document endpoint; returns this
// error message
export const MISSING_PASSWORD_ERROR = [
  'Missing password',
  'Document is locked with a user password',
];

// Lighthouse limits file names to 255 characters
export const MAX_FILE_NAME_LENGTH = 255;
export const FILE_NAME_TOO_LONG_ERROR = `Your file name can’t exceed ${MAX_FILE_NAME_LENGTH} characters. Rename your file and try again.`;

export const INCORRECT_PASSWORD_ERROR =
  'We couldn’t unlock your PDF. Save the PDF without a password and try again.';

export const errormessageMaps = {
  'exceeds the page size limit':
    'Your file can’t have a width and height larger than 78 inches by 101 inches. Follow the instructions for your device on how to resize the file and try again.',
};

export const reMapErrorMessage = error => {
  const result = Object.keys(errormessageMaps).find(mapKey =>
    error.includes(mapKey),
  );
  return errormessageMaps?.[result] ?? error;
};

export const checkIsFileNameTooLong = (name = '') =>
  name.length > MAX_FILE_NAME_LENGTH;

export const createPayload = (file, _formId, password) => {
  const payload = new FormData();
  payload.append('decision_review_evidence_attachment[file_data]', file);
  if (password) {
    payload.append('decision_review_evidence_attachment[password]', password);
  }
  return payload;
};

export const parseResponse = (response, { name, size }) => {
  setTimeout(() => {
    focusFileCard(name);
  });

  return {
    name,
    size,
    confirmationCode: response.data.attributes.guid,
    attachmentId: '',
  };
};

export const hasSomeUploading = files => files.some(file => file?.uploading);

// Do not show upload if any error exist
export const checkUploadVisibility = (files, errorSchema) =>
  !files.some((file, index) => {
    const errors =
      errorSchema?.[index]?.__errors ||
      [file.errorMessage].filter(error => error);
    return errors.length > 0;
  });

export const createContent = (content = {}) => ({
  cancel: content.cancel || 'Cancel',
  cancelLabel: fileName =>
    content.cancelLabel?.(fileName) || `Cancel upload of ${fileName}`,

  delete: content.delete || 'Delete file',
  deleteLabel: fileName =>
    content.deleteLabel?.(fileName) || `Delete ${fileName}`,

  error: content.error || 'Error',

  modalTitle:
    content.modalTitle || 'Are you sure you want to delete this file?',
  modalContent: fileName =>
    content.modalContent?.(fileName) || (
      <div className="overflow-wrap-word">
        We’ll delete the uploaded file <strong>{fileName || 'Unknown'}</strong>
      </div>
    ),
  modalYesButton: content.modalYesButton || 'Yes, delete this file',
  modalNoButton: content.modalNoButton || 'No, keep this',

  newFile: content.newFile || 'Upload a new file',

  password: content.password || 'Add password',
  passwordLabel: fileName =>
    content.passwordLabel?.(fileName) || `Add a password for ${fileName}`,

  tryAgain: content.tryAgain || 'Try again',
  tryAgainLabel: fileName =>
    content.tryAgainLabel?.(fileName) || `Try uploading ${fileName} again`,

  upload: content.buttonText || 'Upload',
  uploadAnother: content.addAnotherLabel || 'Add another file',
});
