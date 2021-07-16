import React from 'react';
import { connect } from 'react-redux';

export const SubmissionError = () => (
  <va-alert status="error">
    <h3 slot="headline">We’re sorry. Your request wasn’t submitted.</h3>

    <p className="vads-u-font-size--base vads-u-font-family--sans">
      Your request for financial help wasn’t submitted because something went
      wrong on our end. We’re working to fix the problem, but it may take us a
      while.
    </p>

    <h4 className="vads-u-margin-top--0 vads-u-font-size--h5">
      What you can do
    </h4>

    <p className="vads-u-margin-top--0 vads-u-font-size--base vads-u-font-family--sans">
      We've saved your progress. Please try to submit your request again
      tomorrow.
    </p>
  </va-alert>
);

const ServerError = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    data-testid="server-error"
    status="error"
  >
    <h3 slot="headline">We're sorry. Something went wrong on our end.</h3>

    <p className="vads-u-font-size--base vads-u-font-family--sans">
      You're unable to submit a Financial Status Report (VA Form 5655) because
      something went wrong on our end. Please try again later.
    </p>
  </va-alert>
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
