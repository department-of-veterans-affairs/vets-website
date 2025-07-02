import React from 'react';

const SubmissionInstructions = () => {
  return (
    <div>
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        How to submit your form
      </h3>
      <p className="vads-u-margin-top--4">
        <strong>Note:</strong> This form does not submit automatically. After
        you review your information, download your completed VA Form 22-1919.
        Then, follow the steps provided at the end of the form to complete your
        submission.
      </p>
      <p className="vads-u-margin-top--4">
        <strong>If your institution has a facility code:</strong> You will need
        to visit the Education File Upload Portal, and upload your saved VA Form
        22-1919.
      </p>
      <p className="vads-u-margin-top--4">
        <strong>
          If your institution doesn’t have a VA facility code or if you are
          submitting the form because your institution has changed ownership:
        </strong>{' '}
        You will need to email your downloaded PDF to your State Approving
        Agency (SAA).
      </p>
    </div>
  );
};

export default SubmissionInstructions;
