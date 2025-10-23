import React from 'react';

export default {
  required: true,
  notice: (
    <>
      <div className="vads-u-margin-y--1p5">
        <strong>Important:</strong> The purpose of this form is to get
        information from you that could change your VA benefits. By submitting
        this application, you give permission to make benefit payment changes
        that could result in overpayment. If this happens, you will be notified
        by VA regarding repayment options.
      </div>
      <div className="vads-u-margin-y--2p5">
        <strong>By submitting this form</strong> you certify that you are the
        claimant and the information you gave above is true and correct to the
        best of your knowledge and belief.
      </div>
      <div className="vads-u-margin-y--1p5">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </div>
    </>
  ),
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I have read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy
      </a>
    </span>
  ),
  error: 'You must accept the privacy policy before continuing',
};
