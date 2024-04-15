import React from 'react';

const BeforeYouDownloadDropdown = () => {
  return (
    <div className="before-you-download-dropdown" data-testid="before-download">
      <va-additional-info
        trigger="What to know before you print or download"
        data-testid="dropdown-info"
        uswds
      >
        <ul>
          <li>
            <strong>If you download this page,</strong> we’ll include a list of
            allergies and reactions in your VA medical records.
          </li>
          <li>
            <strong>If you’re on a public or shared computer,</strong> remember
            that downloading saves a copy of your records to the computer you’re
            using.
          </li>
        </ul>
      </va-additional-info>
    </div>
  );
};

export default BeforeYouDownloadDropdown;
