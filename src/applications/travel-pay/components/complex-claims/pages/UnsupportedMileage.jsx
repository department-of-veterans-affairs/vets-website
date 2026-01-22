import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import { BTSSS_PORTAL_URL } from '../../../constants';

const UnsupportedMileage = () => {
  const navigate = useNavigate();

  const title = 'Complete and file your claim in BTSSS';

  useSetPageTitle(title);
  useSetFocus();

  return (
    <>
      <h1>{title}</h1>
      <p>
        Your travel was one way or you started from somewhere other than your
        home address. We can’t file your travel reimbursement claim here right
        now. But you can still file your claim in the Beneficiary Travel Self
        Service System (BTSSS).
      </p>
      <p>Any information you’ve added here will be available in BTSSS.</p>
      <va-link
        href={BTSSS_PORTAL_URL}
        text="Complete and file your claim in BTSSS"
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
