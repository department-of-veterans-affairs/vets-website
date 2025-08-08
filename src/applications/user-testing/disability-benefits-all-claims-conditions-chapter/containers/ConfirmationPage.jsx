import React, { useEffect, useRef } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);
  const form = useSelector(state => state.form || {});
  const { submission, formId, data = {} } = form;
  const { fullName } = data;
  const confirmationNumber = submission?.response?.confirmationNumber;
  const fullNameText = fullName
    ? `${fullName.first ?? ''} ${fullName.middle ?? ''} ${fullName.last ?? ''}`
        .replace(/\s+/g, ' ')
        .trim() + (fullName.suffix ? `, ${fullName.suffix}` : '')
    : '';
  const submitDate = submission?.timestamp
    ? parseISO(submission.timestamp)
    : null;

  useEffect(() => {
    if (alertRef?.current) {
      scrollTo('topScrollElement');
      waitForRenderThenFocus('h2', alertRef.current);
    }
  }, []);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>

      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">Your application has been submitted</h2>
      </va-alert>

      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">Print this page for your records.</p>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          File for disability compensation Claim{' '}
          <span className="vads-u-font-weight--normal">(Form {formId})</span>
        </h3>

        {fullNameText && <span>for {fullNameText}</span>}

        {confirmationNumber ? (
          <>
            <h4>Confirmation number</h4>
            <p>{confirmationNumber}</p>
          </>
        ) : null}

        {isValid(submitDate) ? (
          <p>
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        ) : null}

        <va-button onClick={window.print} text="Print this for your records" />
      </div>
      <a className="vads-c-action-link--green vads-u-margin-bottom--4" href="/">
        Go back to VA.gov
      </a>
    </div>
  );
};

export default ConfirmationPage;
