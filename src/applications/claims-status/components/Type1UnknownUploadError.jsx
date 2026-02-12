import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom-v5-compat';
import { setPageFocus } from '../utils/page';

/**
 * Type1UnknownUploadError component displays an alert for unknown Type 1 upload errors
 * These are errors that occur before reaching Lighthouse where we can't identify
 * the specific cause (as opposed to known errors like duplicates or invalid claimant)
 * @param {Array} errorFiles - Array of error objects with fileName and docType
 */
export default function Type1UnknownUploadError({ errorFiles }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = e => {
    e.preventDefault();

    // Check if we're already on the files page
    const isOnFilesPage = location.pathname.endsWith('/files');

    if (!isOnFilesPage) navigate('../files#other-ways-to-send');
    setPageFocus('#other-ways-to-send');
  };

  if (!errorFiles || errorFiles.length === 0) {
    return null;
  }

  const fileText = errorFiles.length === 1 ? 'File' : 'Files';

  return (
    <>
      <p className="vads-u-margin-top--0">
        We're sorry. There was a problem with our system, and we couldn't
        process the files you tried to submit. You can submit these files by
        mail or in person instead.
      </p>
      <p>
        If you try to submit these files again in this tool, we expect we'll
        have the same problem.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>{fileText} we couldn't process:</strong>
      </p>
      <ul
        className="vads-u-margin-y--2"
        aria-label="Files that couldn't be processed"
      >
        {errorFiles.map(file => (
          <li key={file.fileName}>
            <strong
              data-dd-privacy="mask"
              data-dd-action-name="failed upload filename"
            >
              {file.fileName}
            </strong>
            <br />
            File type: {file.docType || 'Unknown'}
          </li>
        ))}
      </ul>
      <va-link-action
        href="../files#other-ways-to-send"
        text="Learn how to submit documents by mail or in person"
        type="secondary"
        onClick={handleLinkClick}
      />
    </>
  );
}

Type1UnknownUploadError.propTypes = {
  errorFiles: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      docType: PropTypes.string,
    }),
  ),
};
