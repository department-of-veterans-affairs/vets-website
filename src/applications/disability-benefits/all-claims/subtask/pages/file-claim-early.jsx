import React from 'react';

// import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import { DISABILITY_526_V2_ROOT_URL } from '../../constants';

const FileClaimPage = () => (
  <div
    id={pageNames.fileClaimEarly}
    className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2"
  >
    <p className="vads-u-margin-top--0">
      Based on your separation date, you’ll file for disability benefits using{' '}
      <strong>VA Form 21-526EZ</strong>.
    </p>
    {/*
    <a
      href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
      className="vads-c-action-link--green"
      onClick={() => {
        recordEvent({
          event: 'howToWizard-hidden',
          'reason-for-hidden-wizard':
            'wizard completed, starting 526 flow (less than 90 days to discharge)',
        });
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'primary',
          'button-click-label': 'File a disability claim online',
        });
      }}
      aria-describedby="other_ways_to_file_526"
    >
      File a disability claim online
    </a>
    */}
    <p id="other_ways_to_file_526" className="vads-u-margin-bottom--0">
      <a
        href="/disability/how-to-file-claim/"
        // onClick={() => {
        //   recordEvent({
        //     event: 'howToWizard-alert-link-click',
        //     'howToWizard-alert-link-click-label':
        //       'Learn about other ways you can file a disability claim',
        //   });
        // }}
      >
        Learn about other ways you can file a disability claim
      </a>
    </p>
  </div>
);

export default {
  name: pageNames.fileClaimEarly,
  component: FileClaimPage,
  back: pageNames.rad,
  next: `${DISABILITY_526_V2_ROOT_URL}/introduction`,
};
