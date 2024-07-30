import React, { useEffect, useRef } from 'react';
import { format, isValid } from 'date-fns';

import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import GetFormHelp from './GetFormHelp';

export const ConfirmationPageView = ({
  formName = 'VA Form',
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
  const dateSubmitted = isValid(submitDate)
    ? format(submitDate, 'MMMM d, yyyy')
    : null;
  const dynamicHeadline = `You've submitted your ${formName} ${formType}`;
  const headline = `${headlineText || dynamicHeadline} ${dateSubmitted &&
    ` on ${dateSubmitted}`}`;

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert uswds status="success" ref={alertRef}>
        <h2 slot="headline">{headline}</h2>
        {typeof nextStepsText === 'string' ? (
          <p>{nextStepsText}</p>
        ) : (
          nextStepsText
        )}
        <p>{`Your confirmation number is ${confirmationNumber}`}</p>
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
        <va-button
          className="usa-button vads-u-margin-top--0 screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>
      {childContent || null}
      <div className="vads-u-margin-bottom--6">
        <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
          How to contact us if you have questions
        </h2>
        <p>
          Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />
          (TTY: <va-telephone contact={CONTACTS[711]} />) We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <p className="vads-u-margin-bottom--4">
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        <p>
          <a
            className="vads-c-action-link--green vads-u-margin-bottom--4"
            href="/"
          >
            Go back to VA.gov homepage
          </a>
        </p>
      </div>
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};
