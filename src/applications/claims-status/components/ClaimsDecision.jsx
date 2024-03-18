import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import NextSteps from './claim-status-tab/NextSteps';

const formatDate = closedDate => moment(closedDate).format('MMMM D, YYYY');

const headerText = closedDate =>
  `We decided your claim on ${formatDate(closedDate)}`;

const ClaimsDecision = ({ completedDate, showClaimLettersLink }) => (
  <>
    <va-alert uswds="false" class="vads-u-margin-y--2">
      <h3 className="claims-alert-header" slot="headline">
        {completedDate && headerText(completedDate)}
      </h3>
      {showClaimLettersLink ? (
        <p>
          You can download your decision letter online now. We also mailed you
          this letter.
        </p>
      ) : (
        <p>
          We mailed you a decision letter. It should arrive within 10 days after
          the date we decided your claim. It can sometimes take longer.
        </p>
      )}

      {showClaimLettersLink && (
        <p>
          <Link className="vads-c-action-link--blue" to="your-claim-letters">
            Get your claim letters
          </Link>
        </p>
      )}
    </va-alert>

    {!showClaimLettersLink && (
      <va-alert
        background-only
        class="vads-u-margin-y--2"
        status="warning"
        uswds="false"
      >
        <h3 className="claims-alert-header">
          Decision letters aren’t available to download right now.
        </h3>
        <p className="vads-u-margin-y--0">
          We’re fixing some problems with this tool. Check back later. If you
          need information about your decision letters now, call us at{' '}
          <va-telephone contact="8008271000" uswds="false" /> (TTY: 711). We’re
          here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </va-alert>
    )}
    <NextSteps />
  </>
);

ClaimsDecision.propTypes = {
  showClaimLettersLink: PropTypes.bool.isRequired,
  completedDate: PropTypes.string,
};

export default ClaimsDecision;
