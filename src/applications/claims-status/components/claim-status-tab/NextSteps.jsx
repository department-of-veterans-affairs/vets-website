import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function NextSteps() {
  return (
    <div
      data-testid="next-steps"
      className="next-steps-container vads-u-margin-bottom--4"
    >
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Next steps
      </h3>
      <p>
        <strong>If you agree with your claim decision</strong>, you don’t need
        to do anything else.
      </p>
      <p>
        <strong>If you have new evidence</strong> that shows your condition is
        service connected, you can file a Supplemental Claim. We’ll review your
        claim decision using the new evidence.
        <br />
        <VaLink
          href="/decision-reviews/supplemental-claim/"
          text="Learn more about Supplemental Claims"
        />
      </p>
      <p>
        <strong>
          If your condition has gotten worse since you filed your claim
        </strong>
        , you can file a new claim for an increase in disability compensation.
        <br />
        <VaLink
          href="/disability/how-to-file-claim/"
          text="Learn how to file a VA disability claim"
        />
      </p>
      <p>
        <strong>If you disagree with your claim decision</strong>, you can
        request a decision review.
        <br />
        <VaLink
          href="/resources/choosing-a-decision-review-option/"
          text="Find out how to choose a decision review option"
        />
      </p>
      <p>
        <strong>If you’re not enrolled in VA health care</strong>, you can apply
        now.
        <br />
        <VaLink
          href="/health-care/apply-for-health-care-form-10-10ez/"
          text="Apply for VA health care benefits"
        />
      </p>
    </div>
  );
}

export default NextSteps;
