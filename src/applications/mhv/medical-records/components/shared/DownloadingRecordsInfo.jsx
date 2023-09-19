import React from 'react';

const DownloadingRecordsInfo = props => {
  const { allowTxtDownloads } = props;

  const publicSharedContent = () => {
    return (
      <>
        <strong>If you’re on a public or shared computer,</strong> print your
        records instead of downloading. Downloading will save a copy of your
        records to the public computer.
      </>
    );
  };

  return (
    <va-additional-info
      trigger="What to know about downloading records"
      class="no-print vads-u-margin-bottom--4"
    >
      {/* Use the "!== false" syntax because checking the inverse causes the component to be resized incorrectly
            when the value changes from undefined to true. */}
      {allowTxtDownloads !== false ? <p>{publicSharedContent()}</p> : null}
    </va-additional-info>
  );
};

export default DownloadingRecordsInfo;
