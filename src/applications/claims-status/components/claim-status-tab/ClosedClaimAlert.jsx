import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

const formatDate = closedDate => moment(closedDate).format('MMMM D, YYYY');

function ClosedClaimAlert({ claim }) {
  const { closeDate, decisionLetterSent } = claim.attributes;

  return (
    <va-alert class="vads-u-margin-bottom--4" status="info" uswds>
      <h2 id="track-your-status-on-mobile" slot="headline">
        We closed your claim on {formatDate(closeDate)}
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
  claim: PropTypes.object,
};

export default ClosedClaimAlert;
