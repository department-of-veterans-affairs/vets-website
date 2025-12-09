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
            <va-process-list-item header="VA will review your claim">
              <p>
                You can check the status of this claim or review all your travel
                claims on your travel reimbursement claims page.
              </p>
              <va-link
                href="/my-health/travel-pay/claims/"
                text="Check your travel reimbursement claim status"
              />
            </va-process-list-item>
            <va-process-list-item header="If we approve your claim, we’ll send your pay through direct deposit">
              <p>
                You must have direct deposit set up in order to receive your
                funds. Direct deposit for travel pay is different than the
                direct deposit used for other VA claims. If you’ve already set
                up direct deposit for travel pay, no additional other are
                needed.
              </p>
              <va-link
                href={REIMBURSEMENT_URL}
                text="Set up direct deposit for travel pay"
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
