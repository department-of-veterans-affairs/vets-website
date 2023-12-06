import React from 'react';
import PropTypes from 'prop-types';

const DownloadingRecordsInfo = props => {
  const { allowTxtDownloads } = props;

  const publicSharedContent = () => {
    return (
      <>
        <span className="vads-u-font-weight--bold">
          If you’re on a public or shared computer,
        </span>{' '}
        remember that downloading will save a copy of your records to the
        computer.
      </>
    );
  };

  return (
    <va-additional-info
      trigger="What to know before you download"
      class="no-print vads-u-margin-bottom--3"
    >
      {/* Use the "!== false" syntax because checking the inverse causes the component to be resized incorrectly
            when the value changes from undefined to true. */}
      {allowTxtDownloads !== false ? (
        <ul>
          <li>{publicSharedContent()}</li>
          <li>
            <span className="vads-u-font-weight--bold">
              If you use assistive technology,
            </span>{' '}
            a Text file (.txt) may work better for technology such as screen
            reader, screen enlargers, or Braille displays.
          </li>
        </ul>
      ) : (
        <p>{publicSharedContent()}</p>
      )}
    </va-additional-info>
  );
};

DownloadingRecordsInfo.propTypes = {
  allowTxtDownloads: PropTypes.bool,
};

export default DownloadingRecordsInfo;
