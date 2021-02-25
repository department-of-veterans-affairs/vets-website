import React from 'react';
import { pageNames } from '../constants';
import StartFormButton from '../components/StartFormButton';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const Submit = ({ setWizardStatus }) => {
  const label = 'Submit a Financial Status Report';

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, you can use our online Financial
        Status Report (VA Form 5655) to request help with your debt.
      </p>
      <StartFormButton
        setWizardStatus={setWizardStatus}
        label={label}
        ariaId={'other_ways_to_file_526'}
      />
      <p>
        <strong>If you submitted VA Form 5655 in the past 6 months</strong>
      </p>
      <p>
        You don’t need to submit a new request unless you have changes to
        report. Call us at <Telephone contact={'800-827-0648'} /> (or{' '}
        <Telephone contact={'1-612-713-6415'} /> from overseas). We’re here
        Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If you have hearing
        loss, call TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />.
      </p>
    </div>
  );
};

export default {
  name: pageNames.submit,
  component: Submit,
};
