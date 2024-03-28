import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { buildDateFormatter } from '../../utils/helpers';

const headerText = closeDate => {
  return closeDate
    ? `We closed your claim on ${buildDateFormatter()(closeDate)}`
    : 'We closed your claim';
};
function ClosedClaimAlert({ closeDate, decisionLetterSent = false }) {
  return (
    <va-alert class="vads-u-margin-bottom--4" status="info" uswds>
      <h2 id="claims-alert-header" slot="headline">
        {headerText(closeDate)}
      </h2>
      {decisionLetterSent ? (
        <>
          <p>
            You can download your decision letter online now. You can also get
            letters related to your claims.
          </p>
          <p className="vads-u-margin-y--0">
            We’ll also send you a copy of your decision letter by mail. It
            arrive within 10 days after the date we closed your claim, but it
            take longer.
          </p>
          <div className="link-action-container">
            <Link className="vads-c-action-link--blue" to="your-claim-letters">
              Get your claim letters
            </Link>
          </div>
        </>
      ) : (
        <p className="vads-u-margin-y--0">
          We mailed you a decision letter. It should arrive within 10 days after
          the date we decided your claim. It can sometimes take longer.
        </p>
      )}
    </va-alert>
  );
}

ClosedClaimAlert.propTypes = {
  closeDate: PropTypes.string,
  decisionLetterSent: PropTypes.bool,
};

export default ClosedClaimAlert;
