import React from 'react';
// import { Link } from 'react-router';

import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import { DISABILITY_526_V2_ROOT_URL } from '../../constants';

const FileClaimPage = () => (
  <>
    <h1>You can file for disability compensation</h1>
    <div
      id={pageNames.fileClaim}
      className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2"
    >
      <p className="vads-u-margin-top--0">
        Based on your responses, you’ll file for disability benefits using{' '}
        <strong>VA Form 21-526EZ</strong>.
      </p>
      {/* <Link
        to={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="vads-c-action-link--green"
        onClick={() => {
          recordEvent({
            event: 'howToWizard-hidden',
            'reason-for-hidden-wizard':
              'wizard completed, starting 526 disability compensation flow',
          });
          recordEvent({
            event: 'cta-button-click',
            'button-type': 'primary',
            'button-click-label': 'File a disability claim online',
          });
        }}
      >
        File a disability claim online
      </Link> */}
      <p id="other_ways_to_file_526" className="vads-u-margin-bottom--0">
        <a
          href="/disability/how-to-file-claim/"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label':
                'Learn about other ways you can file a disability claim',
            });
          }}
        >
          Learn about other ways you can file a disability claim
        </a>
      </p>
    </div>
  </>
);

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
  back: pageNames.appeals,
  next: `${DISABILITY_526_V2_ROOT_URL}/introduction`,
};
