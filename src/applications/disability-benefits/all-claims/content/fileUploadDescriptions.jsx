import React from 'react';

import { MAX_FILE_SIZE_MB, MAX_PDF_FILE_SIZE_MB } from '../constants';
import { getPdfSizeFeature } from '../utils';

/**
 * Generic description added to file upload pages
 * @param {String|ReactComponent} uploadTitle - page title
 * @param {Boolean} uploadPdfLimit - state of the evss_upload_limit_150mb
 *   feature flag
 */
export const UploadDescription = ({
  uploadTitle,
  showPdfSize = getPdfSizeFeature(),
}) => (
  <div>
    {uploadTitle && <h3 className="vads-u-font-size--h5">{uploadTitle}</h3>}
    <p>
      You can upload your document in a .pdf, .jpg, .jpeg, .png, .gif, .bmp, or
      .txt file format. You’ll first need to scan a copy of your document onto
      your computer or mobile phone. You can then upload the document from
      there.
      <br />
      Guidelines for uploading a file:
    </p>
    <ul>
      <li>
        File types you can upload: .pdf, .jpg, .jpeg, .png, .gif,.bmp, or .txt
      </li>
      <li>
        {`Maximum ${
          showPdfSize ? 'non-PDF ' : ''
        }file size: ${MAX_FILE_SIZE_MB}MB`}
      </li>
      {showPdfSize && (
        <li>{`Maximum PDF file size: ${MAX_PDF_FILE_SIZE_MB}MB`}</li>
      )}
    </ul>
    <p>
      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
);
