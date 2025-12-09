import React from 'react';
import { PAST_APPOINTMENTS_LINK } from '../../../constants';
import WhatHappensNextSection from './WhatHappensNextSection';
import { ComplexClaimsHelpSection } from '../../HelpText';

const CreateClaimErrorPage = () => {
  return (
    <div>
      <h1>We couldn’t start your claim</h1>
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">Something went wrong on our end</h2>
        <p className="vads-u-margin-y--0">
          We’re sorry. We couldn’t start your travel reimbursement claim. Try to
          file your claim again.
        </p>
        <va-link
          href={PAST_APPOINTMENTS_LINK}
          text="Go to past appointments to file for travel pay"
        />
      </va-alert>
      <WhatHappensNextSection isError />
      <ComplexClaimsHelpSection />
    </div>
  );
};

export default CreateClaimErrorPage;
