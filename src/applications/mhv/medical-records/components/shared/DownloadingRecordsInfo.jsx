import React from 'react';

const DownloadingRecordsInfo = props => {
  const { allowTxtDownloads } = props;

  const publicSharedContent = () => {
    return (
      <>
        <strong>If you’re on a public or shared computer,</strong> remember that
        downloading saves a copy of your records to the computer you’re now
        using.
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
            <strong>If you use assistive technology,</strong> a Text file (.txt)
            may work better for technology such as screen reader, screen
            enlargers, or Braille displays.
          </li>
        </ul>
      ) : (
        <p>{publicSharedContent()}</p>
      )}
    </va-additional-info>
  );
};

export default DownloadingRecordsInfo;
