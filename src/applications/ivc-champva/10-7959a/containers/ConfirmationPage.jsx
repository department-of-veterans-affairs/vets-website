import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { applicantWording } from '../../shared/utilities';
import {
  CHAMPVA_PHONE_NUMBER,
  CHAMPVA_CLAIMS_ADDRESS,
  IVC_APPEALS_ADDRESS,
} from '../../shared/constants';

const ConfirmationPage = () => {
  const { formData, timestamp } = useSelector(state => ({
    timestamp: state.form.submission?.timestamp,
    formData: state.form.data,
  }));
  const submitDate = new Date(timestamp);

  useEffect(() => focusElement('h2'), []);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Application for CHAMPVA benefits</h2>
      </div>

      <va-alert status="success">
        <h2 slot="headline">You’ve submitted your CHAMPVA claim form</h2>
      </va-alert>

      <div className="inset">
        <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
          Your submission information
        </h2>
        {formData.applicantName && (
          <>
            <p className="veterans-full-name dd-privacy-hidden">
              <strong>Applicant’s name</strong>
              <br />
              {applicantWording(formData, false, false, false)}
            </p>
            <p className="signer-name dd-privacy-hidden">
              <strong>Who submitted this form</strong>
              <br />
              {formData.statementOfTruthSignature || formData.signature}
            </p>
          </>
        )}
        {isValid(submitDate) && (
          <p className="date-submitted">
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        )}
        <p>You can print this confirmation page for your records.</p>
        <va-button
          uswds
          className="usa-button screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>

      <h2>What to expect next</h2>
      <p>It takes about 90 days to process your claim.</p>
      <p>
        If we have any questions or need additional information, we’ll contact
        you.
      </p>

      <h3>If we decide we can cover this claim under CHAMPVA</h3>
      <p>
        We’ll send you an explanation of benefits. This document explains
        details about the amount we’ll cover.
      </p>

      <h3>If we decide we can’t cover this claim under CHAMPVA</h3>
      <p>If you disagree with our decision, you can request an appeal.</p>
      <p>Mail a letter requesting an appeal to this address:</p>

      {IVC_APPEALS_ADDRESS}

      <h2>How to contact us about CHAMPVA claims</h2>
      <p>
        If you have any questions about your claim, call us at{' '}
        <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (TTY: 711). We’re here{' '}
        Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
      </p>
      <p>
        Or you can send us a letter with questions about your claim to this
        address:
      </p>

      {CHAMPVA_CLAIMS_ADDRESS}

      <p>You can also contact us online through Ask VA.</p>
      <p>
        <va-link href="https://ask.va.gov/" text="Go to Ask VA" />
      </p>
      <p>
        <va-link-action href="/" text="Go back to VA.gov" />
      </p>
    </div>
  );
};

export default ConfirmationPage;
