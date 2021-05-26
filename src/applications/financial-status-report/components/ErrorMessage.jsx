import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const SubmissionError = () => (
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

const ServerError = () => (
  <div className="row vads-u-margin-bottom--5">
    <AlertBox
      status="error"
      headline="We're sorry. Something went wrong on our end."
      content={
        <>
          <p>
            You're unable to submit a Financial Status Report (VA Form 5655)
            because something went wrong on our end. Please try again later.
          </p>
        </>
      }
    />
  </div>
);

const ErrorMessage = () => {
  // scaffolding in place to handle multiple error codes
  // const [error] = errorCode.errors ?? [];
  return <ServerError />;
};

const mapStateToProps = ({ fsr }) => ({
  errorCode: fsr.errorCode,
});

export default connect(mapStateToProps)(ErrorMessage);
