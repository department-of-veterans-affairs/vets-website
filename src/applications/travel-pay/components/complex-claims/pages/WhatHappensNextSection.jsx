import React from 'react';
import PropTypes from 'prop-types';

import {
  BTSSS_PORTAL_URL,
  FORM_103542_LINK,
  REIMBURSEMENT_URL,
} from '../../../constants';

const WhatHappensNextSection = ({ isError }) => {
  return (
    <>
      <h2 className="vads-u-margin-top--4">What happens next</h2>
      {isError ? (
        <div>
          <p>
            You can still file a claim within 30 days of this appointment these
            other ways:
          </p>
          <ul>
            <li>
              <p className="vads-u-margin-y--2">
                Online 24/7 through the Beneficiary Travel Self Service System
                (BTSSS)
              </p>
              <va-link
                external
                href={BTSSS_PORTAL_URL}
                text="File a travel claim online"
              />
            </li>
            <li>
              <p className="vads-u-margin-y--2">
                VA Form 10-3542 by mail, fax, email, or in person
              </p>
              <va-link
                href={FORM_103542_LINK}
                text="Learn more about VA Form 10-3542"
              />
            </li>
          </ul>
        </div>
      ) : (
        <>
          <va-process-list>
            <va-process-list-item header="We’ll review your claim">
              <p>
                You can check the status of this claim or review all your travel
                claims on your travel reimbursement claims page.
              </p>
              <va-link
                href="/my-health/travel-pay/claims/"
                text="Review your travel reimbursement claim status"
              />
            </va-process-list-item>
            <va-process-list-item header="If we approve your claim, we’ll deposit your funds into your bank account">
              <p>
                You must have direct deposit set up to get your travel pay. Even
                if you already set up direct deposit for your VA benefits,
                you’ll need to set up another direct deposit for VA travel pay.
              </p>
              <va-link
                href={REIMBURSEMENT_URL}
                text="Learn how to set up direct deposit for travel pay"
              />
            </va-process-list-item>
          </va-process-list>
        </>
      )}
    </>
  );
};

WhatHappensNextSection.propTypes = {
  isError: PropTypes.bool,
};

export default WhatHappensNextSection;
