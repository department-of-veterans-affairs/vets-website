import React from 'react';
import PropTypes from 'prop-types';
import { MAX_FILE_SIZE_MB, MAX_PDF_FILE_SIZE_MB } from '../constants';

/**
 * Generic description added to file upload pages
 * @param {String|ReactComponent} uploadTitle - page title
 */
export const UploadDescription = ({ uploadTitle }) => (
  <div>
    {uploadTitle && <h3 className="vads-u-font-size--h5">{uploadTitle}</h3>}
    <p>
      You can upload your file in a .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      format. You’ll first need to scan a copy of your file onto your computer
      or mobile phone. You can then upload the file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>
        File types you can upload: .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      </li>
      <li>{`Maximum non-PDF file size: ${MAX_FILE_SIZE_MB}MB`}</li>
      <li>{`Maximum PDF file size: ${MAX_PDF_FILE_SIZE_MB}MB`}</li>
    </ul>
    <p>
      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
);

UploadDescription.propTypes = {
  uploadTitle: PropTypes.string,
};
