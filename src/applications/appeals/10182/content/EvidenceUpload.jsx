import React from 'react';

import {
  SUPPORTED_UPLOAD_TYPES,
  MAX_FILE_SIZE_MB,
} from '../../shared/constants';

export const evidenceUploadTitle = 'Additional evidence';

export const fileTypes = (types = SUPPORTED_UPLOAD_TYPES) =>
  types.length > 1
    ? `.${types.slice(0, -1).join(', .')}${
        types.length === 2 ? '' : ','
      } or .${types.slice(-1)}`
    : `.${types}`;

export const EvidenceUploadLabel = (
  <h3 className="vads-u-display--inline">Upload your additional evidence</h3>
);

export const EvidenceUploadDescription = (
  <div>
    <p>
      You can upload your document in a {fileTypes()} file format. You’ll first
      need to scan a copy of your document onto your computer or mobile phone.
      You can then upload the document from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>File types you can upload: {fileTypes()}</li>
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
