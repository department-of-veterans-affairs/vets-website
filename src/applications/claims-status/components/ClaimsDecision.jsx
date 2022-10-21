import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const formatDate = closedDate => moment(closedDate).format('MMMM D, YYYY');

const headerText = closedDate =>
  `We closed your claim on ${formatDate(closedDate)}`;

const ClaimsDecision = ({ completedDate }) => (
  <>
    <va-alert>
      <h3 className="claims-alert-header vads-u-font-size--h4" slot="headline">
        {completedDate && headerText(completedDate)}
      </h3>
      <p>
        We finished reviewing your claim and a decision has been made. You can
        find your decision letter in the claim letters page.
      </p>
      <p>
        A decision packet will also be mailed to you. Typically, decision
        notices are received within 10 days, but this is dependent upon U.S.
        Postal Service timeframes.
      </p>
      <p>
        <a
          className="vads-c-action-link--blue"
          href="/track-claims/your-claim-letters"
        >
          Get your claim letters
        </a>
      </p>
    </va-alert>
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
  completedDate: PropTypes.string,
};

export default ClaimsDecision;
