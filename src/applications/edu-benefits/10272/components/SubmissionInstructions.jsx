import React from 'react';

const SubmissionInstructions = () => {
  return (
    <div>
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        How to submit your form
      </h3>
      <p className="vads-u-margin-top--4">
        <strong>Note:</strong> This form does not submit automatically. After
        you review your information, download the completed VA Form 22-10272.
        Then, upload it manually with your itemized listing including mandatory
        fees and your proof of enrollment through{' '}
        <va-link
          text="QuickSubmit"
          href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
          external
        />{' '}
        to complete the submission process. You’ll need these items to receive
        reimbursement for costs associated with your prep course. If you would
        rather print and mail your form and attachments, the addresses for your
        region will be listed at the end of this form.
      </p>
    </div>
  );
};

export default SubmissionInstructions;
