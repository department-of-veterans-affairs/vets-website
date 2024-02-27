import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';

const formatDate = closedDate => moment(closedDate).format('MMMM D, YYYY');

const headerText = closedDate =>
  `We decided your claim on ${formatDate(closedDate)}`;

const ClaimsDecision = ({ completedDate, showClaimLettersLink }) => (
  <>
    <va-alert uswds="false">
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
    <h4 className="claims-paragraph-header vads-u-font-size--h3">Next steps</h4>
    <p>
      <strong>If you agree with your claim decision</strong>, you don’t need to
      do anything else.
    </p>
    <p>
      <strong>If you have new evidence</strong> that shows your condition is
      service connected, you can file a Supplemental Claim. We’ll review your
      claim decision using the new evidence.
      <br />
      <a href="/decision-reviews/supplemental-claim/">
        Learn more about Supplemental Claims
      </a>
    </p>
    <p>
      <strong>
        If your condition has gotten worse since you filed your claim
      </strong>
      , you can file a new claim for an increase in disability compensation.
      <br />
      <a href="/disability/how-to-file-claim/">
        Learn how to file a VA disability claim
      </a>
    </p>
    <p>
      <strong>If you disagree with your claim decision</strong>, you can request
      a decision review.
      <br />
      <a href="/resources/choosing-a-decision-review-option/">
        Find out how to choose a decision review option
      </a>
    </p>
    <p>
      <strong>If you’re not enrolled in VA health care</strong>, you can apply
      now.
      <br />
      <a href="/health-care/apply/application/introduction">
        Apply for VA health care benefits
      </a>
    </p>
  </>
);

ClaimsDecision.propTypes = {
  showClaimLettersLink: PropTypes.bool.isRequired,
  completedDate: PropTypes.string,
};

export default ClaimsDecision;
