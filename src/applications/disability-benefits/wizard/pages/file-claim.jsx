import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';
import { formStartButton } from '../wizard-utils';

const FileClaimPage = ({ setWizardStatus }) => {
  const label = 'File a disability claim online';
  const linkText = 'Learn about other ways you can file a disability claim';

  return (
    <div
      id={pageNames.fileClaim}
      className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2"
    >
      <p className="vads-u-margin-top--0">
        Based on your responses, you’ll file for disability benefits using{' '}
        <strong>VA Form 21-526EZ</strong>.
      </p>
      {formStartButton({
        setWizardStatus,
        label,
        eventReason:
          'wizard completed, starting 526 disability compensation flow',
      })}
      <p id="other_ways_to_file_526" className="vads-u-margin-bottom--0">
        <a
          href="/disability/how-to-file-claim/"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label': linkText,
            });
          }}
        >
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
