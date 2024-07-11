import React from 'react';

import {
  SUPPORTED_UPLOAD_TYPES,
  MAX_FILE_SIZE_MB,
} from '../../../shared/constants';

export const additionalInfoUploadTitle =
  'Upload your additional information about your disagreement';

const fileTypes =
  SUPPORTED_UPLOAD_TYPES.length > 1
    ? `.${SUPPORTED_UPLOAD_TYPES.slice(0, -1).join(
        ', .',
      )} or .${SUPPORTED_UPLOAD_TYPES.slice(-1)}`
    : `.${SUPPORTED_UPLOAD_TYPES}`;

export const AdditionalInfoUploadLabel = (
  <h1 className="vads-u-display--inline">
    Upload your additional information about your disagreement
  </h1>
);

export const AdditionalInfoUploadDescription = (
  <div>
    <p>
      You can upload your document in a {fileTypes} file format. You’ll first
      need to scan a copy of your document onto your computer or mobile phone.
      You can then upload the document from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>File types you can upload: {fileTypes}</li>
      <li>{`Maximum file size: ${MAX_FILE_SIZE_MB}MB`}</li>
    </ul>
    <p>
      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
);
