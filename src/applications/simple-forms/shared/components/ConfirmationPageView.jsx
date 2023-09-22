import React, { useEffect, useRef } from 'react';
import { format, isValid } from 'date-fns';

import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import GetFormHelp from './GetFormHelp';

export const ConfirmationPageView = ({
  formType = 'application',
  submitterHeader = 'Applicant',
  submitterName,
  submitDate,
  confirmationNumber,
  content,
  childContent = null,
}) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const { first, middle, last, suffix } = submitterName;
  const { headlineText, nextStepsText } = content;

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
        <h2 slot="headline">{headlineText}</h2>
        <p>{nextStepsText}</p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">Your {formType} information</h3>
        {first && last ? (
          <>
            <h4>{submitterHeader}</h4>
            <p>
              {first} {middle ? `${middle} ` : ''}
              {last}
              {suffix ? `, ${suffix}` : null}
            </p>
          </>
        ) : null}

        {confirmationNumber ? (
          <>
            <h4>Confirmation number</h4>
            <p>{confirmationNumber}</p>
          </>
        ) : null}

        {isValid(submitDate) ? (
          <>
            <h4>Date submitted</h4>
            <p>{format(submitDate, 'MMMM d, yyyy')}</p>
          </>
        ) : null}

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records</p>
        <button
          type="button"
          className="usa-button vads-u-margin-top--0 screen-only"
          onClick={window.print}
        >
          Print this page
        </button>
      </div>
      {childContent || null}
      <a className="vads-c-action-link--green vads-u-margin-bottom--4" href="/">
        Go back to VA.gov
      </a>
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};
