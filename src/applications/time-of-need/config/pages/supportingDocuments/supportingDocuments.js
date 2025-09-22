import React from 'react';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

// Wrapper (still named fileUploadUi so existing call sites stay the same)
export const fileUploadUi = (options = {}) =>
  fileInputMultipleUI({
    required: Object.prototype.hasOwnProperty.call(options, 'required')
      ? options.required
      : false,
    title: 'Select a file to upload',
    addAnotherLabel: 'Upload another file',
    accept: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
    // NOTE: Pattern does not support different size limits per file type.
    // Using 100MB (PDF max per new content). If stricter image size needed,
    // add a custom validation later.
    maxSize: 100 * 1024 * 1024,
    maxTotalSize: 150 * 1024 * 1024,
    hint:
      'You can upload a .jpg, .pdf, or .png file. A .jpg or .png file must be less than 50MB. A .pdf file must be less than 100MB.',
    errorMessages: {
      maxSize:
        'Each file must be within the allowed size. Remove files that are too large and try again.',
      maxTotalSize:
        'Total size of PDF files can’t exceed 150MB. Remove some files and try again.',
      accept:
        'One or more files is in an unsupported format. Remove them and try again.',
    },
    fileUploadUrl: '/v0/mock-upload',
    ...options,
  });

// Schema
export const timeOfNeedAttachments = fileInputMultipleSchema();

// Updated description component (simplified – no accordion, matches screenshot)
export const SupportingFilesDescription = () => (
  <>
    <AutoSaveNotice />
    <h3 className="vads-u-margin-top--0">Upload your supporting documents</h3>
    <p>
      You can submit your documents online now. Or, select Continue to submit
      them by mail or fax later.
    </p>
    <p>
      If you want to mail or fax your documents, we’ll provide instructions
      after you submit this form.
    </p>
  </>
);
