import React from 'react';

const DownloadingRecordsInfo = props => {
  return (
    <va-additional-info
      trigger="What to know about downloading records"
      class="no-print"
    >
      <ul>
        <li>
          <strong>If you’re on a public or shared computer,</strong> print your
          records instead of downloading. Downloading will save a copy of your
          records to the public computer.
        </li>
        <li>
          <strong>If you use assistive technology,</strong> a Text file (.txt)
          may work better for technology such as screen reader, screen
          enlargers, or Braille displays.
        </li>
      </ul>
    </va-additional-info>
  );
};

export default DownloadingRecordsInfo;
