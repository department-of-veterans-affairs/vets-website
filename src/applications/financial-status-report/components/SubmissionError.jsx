import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const SubmissionError = () => (
  <AlertBox
    status="error"
    headline="We’re sorry. Your request wasn’t submitted."
    content={
      <>
        <p>
          Your request for financial help wasn’t submitted because something
          went wrong on our end. We’re working to fix the problem, but it may
          take us a while.
        </p>
        <h5 className="vads-u-margin-top--0">What you can do</h5>
        <p className="vads-u-margin-top--0">
          We've saved your progress. Please try to submit your request again
          tomorrow.
        </p>
      </>
    }
  />
);

export default SubmissionError;
