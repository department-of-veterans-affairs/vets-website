import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { BTSSS_PORTAL_URL } from '../../../constants';

const UnsupportedMileage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>You’ll need to file this claim in another tool</h1>
      <p>
        Right now you can only file travel reimbursement claims on VA.gov if you
        departed from the address we have on file and traveled round trip.
      </p>
      <p>
        To file a one-way claim or a claim from another address, use the
        Beneficiary Travel Self Service System (BTSSS).
      </p>
      <va-link
        href={BTSSS_PORTAL_URL}
        text="Continue this claim on BTSSS"
        external
      />
      <VaButton
        back
        text="Back"
        className="vads-u-display--flex vads-u-margin-y--2"
        onClick={() => navigate(-1)}
      />
    </>
  );
};

export default UnsupportedMileage;
