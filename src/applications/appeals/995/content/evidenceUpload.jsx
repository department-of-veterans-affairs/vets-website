import React from 'react';
import PropTypes from 'prop-types';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import {
  MAX_FILE_SIZE_MB,
  SUPPORTED_UPLOAD_TYPES,
} from '../../shared/constants';

export const UploadDescription = () => {
  const types = SUPPORTED_UPLOAD_TYPES.map(text => text.toUpperCase());
  const list = readableList(types, 'or');
  return (
    <div className="vads-u-margin-top--2">
      <p>
        You’ll need to upload new and relevant evidence for your Supplemental
        Claim. This may include supporting evidence like buddy/lay statements
        and other types of evidence. We’ll prompt you to upload each document
        from your device. But you may need to scan your document first, then
        save each file as a PDF before you can upload it.
      </p>
      <va-additional-info
        trigger="Document upload instructions"
        disable-border
        uswds
      >
        <div>
          <p className="vads-u-margin-top--0">You can do this one of 2 ways:</p>
          <p>
            If you have access to a computer connected to a scanner, you can
            scan each document onto the computer. Save the file as a PDF.
          </p>
          <p className="vads-u-margin-bottom--0">
            If you have access to a smartphone, you can download or use the
            Notes app (for an iPhone) or the Google Drive app (for an Android
            phone) to scan each document onto the phone. The file will
            automatically save as a PDF when you’re done scanning.
          </p>
        </div>
      </va-additional-info>

      <ul className="vads-u-margin-top--0">
        <li>{`File types you can upload: ${list}`}</li>
        <li>{`Maximum file size: ${MAX_FILE_SIZE_MB}MB`}</li>
      </ul>
      <p>
        <em>
          A 1MB file equals about 500 pages of text. A photo is usually about
          6MB. Large files can take longer to upload with a slow Internet
          connection.
        </em>
      </p>
    </div>
  );
};

UploadDescription.propTypes = {
  uploadTitle: PropTypes.string,
};

export const evidenceOtherText = {
  label: (
    <h3 className="vads-u-margin-top--0 vads-u-display--inline">
      Upload your supporting evidence
    </h3>
  ),
  description: 'You’re adding this evidence:',
};
