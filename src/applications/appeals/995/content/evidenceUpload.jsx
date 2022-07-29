import React from 'react';
import PropTypes from 'prop-types';

import { MAX_FILE_SIZE_MB, SUPPORTED_UPLOAD_TYPES } from '../constants';
import { readableList } from '../utils/helpers';
/**
 * Generic description added to file upload pages
 * @param {String|ReactComponent} uploadTitle - page title
 */
export const UploadDescription = ({ uploadTitle }) => {
  const types = readableList(SUPPORTED_UPLOAD_TYPES, 'or');
  return (
    <div>
      {uploadTitle && <h3 className="vads-u-font-size--h5">{uploadTitle}</h3>}
      <p>
        {`You can upload your document in a ${types} file format.`} You’ll first
        need to scan a copy of your document onto your computer or mobile phone.
        You can then upload the document from there.
      </p>
      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>{`File types you can upload: ${types}`}</li>
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

export const evidencePrivateText = {
  label: 'Upload your private medical records',
  description: ' ',
};

export const evidenceOtherText = {
  label: 'Supporting (lay) statements or other evidence',
  description: 'Adding additional evidence:',
};
