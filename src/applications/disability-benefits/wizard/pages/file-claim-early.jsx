import React from 'react';

import { pageNames } from './pageList';
import { formStartButton } from '../wizard-utils';

const FileClaimPage = ({ setWizardStatus }) => {
  const label = 'File a disability claim online';
  const linkText = 'Learn about other ways you can file a disability claim';

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2">
      <p className="vads-u-margin-top--0">
        Based on your separation date, you’ll file for disability benefits using{' '}
        <strong>VA Form 21-526EZ</strong>.
      </p>
      {formStartButton({
        setWizardStatus,
        label,
        ariaId: 'other_ways_to_file_526',
      })}
      <p id="other_ways_to_file_526" className="vads-u-margin-bottom--0">
        <a href="/disability/how-to-file-claim/">{linkText}</a>
      </p>
    </div>
  );
};

export default {
  name: pageNames.fileClaimEarly,
  component: FileClaimPage,
};
