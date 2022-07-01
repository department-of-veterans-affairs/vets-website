import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const formatCompletedDate = completedDate =>
  moment(completedDate).format('MMM D, YYYY');

const completedDateText = completedDate =>
  `We finished reviewing your claim on ${formatCompletedDate(completedDate)}.`;

const ClaimsDecision = ({ completedDate }) => (
  <va-alert background-only>
    <h3 className="claims-alert-header vads-u-font-size--h4">
      Your claim decision is ready
    </h3>
    <p>
      {completedDate ? (
        <>
          {completedDateText(completedDate)}
          <br />
          <br />
        </>
      ) : null}
      You’ll receive a packet by mail that includes details of your claim
      decision.
      <br />
      <br />
      <strong>Note:</strong> Please allow 7 to 10 business days for your packet
      to arrive before contacting us.
      <br />
      <br />
      If you haven’t received your packet yet, you can check your claim decision
      online.
    </p>
    <h4 className="claims-paragraph-header vads-u-font-size--h5">Next steps</h4>
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
  </va-alert>
);

ClaimsDecision.propTypes = {
  completedDate: PropTypes.string,
};

export default ClaimsDecision;
