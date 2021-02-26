import React from 'react';

const SubmissionError = () => {
  return (
    <div className="usa-alert usa-alert-error">
      <div className="usa-alert-body">
        <h4>We can’t submit your application right now</h4>
        <p className="usa-alert-text">
          We’re sorry. Something went wrong and we can't submit your
          application. The information you’ve entered so far has been saved. If
          you’re having trouble, please try again later.
        </p>
      </div>
    </div>
  );
};

export default SubmissionError;
