import React from 'react';
import { PAGE_NAMES } from '../constants';
import StartFormButton from '../components/StartFormButton';
import ContactDMC from '../components/Contacts';

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
      <p className="vads-u-margin-bottom--1">
        <strong>If you submitted VA Form 5655 in the past 6 months</strong>
      </p>
      <p className="vads-u-margin-top--0">
        You don’t need to submit a new request unless you have changes to
        report. <ContactDMC />
      </p>
    </div>
  );
};

export default {
  name: PAGE_NAMES.submit,
  component: Submit,
};
