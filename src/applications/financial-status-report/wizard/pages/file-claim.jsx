import React from 'react';
import { pageNames } from '../constants';
import StartFormButton from '../components/StartFormButton';

const FileClaimPage = ({ setWizardStatus }) => {
  const label = 'Submit a Financial Status Report';

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        You can request a waiver, compromise, or extended monthly payment plan
        for your debt by submitting a Financial Status Report online.
      </p>
      <StartFormButton
        setWizardStatus={setWizardStatus}
        label={label}
        ariaId={'other_ways_to_file_526'}
      />
      <p>
        <strong>Note: </strong>
        Financial status reports are valid for 6 months.
      </p>
      <p>
        If you have submitted a Financial Status Report within the past 6 months
        and have no changes to report, you do not need to submit an FSR again.
        Call us at 800-827-0648 (or 1-612-713-6415 from overseas). We’re here
        Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    </div>
  );
};

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
