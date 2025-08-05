import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { useSelector } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const getFullName = (nameObj = {}) => {
  return [nameObj.first || '', nameObj.middle || '', nameObj.last || '']
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const ConfirmationPage = () => {
  const alertRef = useRef(null);
  const form = useSelector(state => state.form || {});
  const { submission, data = {} } = form;

  // Get the submitted name and format it for display
  const { fullName } = data;
  const veteranFullNameDisplay = getFullName(fullName);

  // If there's a submit date, format it for display
  const submitDate = submission?.timestamp;
  const submitDateValid = isValid(submitDate);
  let submitDateHumanFriendly;
  if (submitDateValid) {
    submitDateHumanFriendly = format(submitDate, 'MMMM d, yyyy');
  }

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <div className="vads-u-margin-y--4">
        <va-alert status="success" ref={alertRef}>
          <h2 slot="headline" className="vads-u-font-size--h3">
            You’ve submitted your application for Veteran Readiness and
            Employment (VR&E)
            {submitDateValid && ` on ${submitDateHumanFriendly}`}
          </h2>
          <p className="vads-u-margin-y--0">
            We’ve received your VR&E application (VA Form 28-1900). After we
            complete our review, we’ll mail you a decision letter with the
            details of our decision.
          </p>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-summary-box>
          <h2 slot="headline" className="vads-u-font-size--h3">
            Your submission information
          </h2>
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--0p5">
            Your name
          </h3>
          {veteranFullNameDisplay}
          {submitDateValid ? (
            <>
              <h3 className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--0p5">
                Date submitted
              </h3>
              {submitDateHumanFriendly}
            </>
          ) : null}
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--0p5">
            Confirmation for your records
          </h3>
          You can print this confirmation page for your records
          <br />
          <div className="vads-u-margin-top--2">
            <va-button onClick={window.print} text="Print this page" />
          </div>
        </va-summary-box>
      </div>
      <h2>What to expect next</h2>
      <p>
        We’ll review your application to determine if you’re eligible for an
        initial evaluation with a Vocational Rehabilitation Counselor (VRC). If
        we determine you’re eligible for an initial evaluation, we’ll send you
        an appointment letter with the date and time when a VRC will meet with
        you.
      </p>
      <p>
        During the initial evaluation, the VRC will gather information to
        determine if you’re entitled to receive VR&E benefits.
      </p>
      <h2>How to contact us if you have questions</h2>
      <p>
        You can ask us about your application online.{' '}
        <a href="https://ask.va.gov/" target="_blank" rel="noreferrer">
          Contact us online through Ask VA (opens in new tab)
        </a>
      </p>
      <p>
        Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <va-telephone contact={CONTACTS[711]} />
        ). We’re here Monday through Friday, 8:00 am to 8:00 pm ET.
      </p>
      <p>
        <strong>If you don’t receive a decision letter,</strong> don’t apply
        again. Contact us online or call us instead.
      </p>

      <a className="vads-c-action-link--green vads-u-margin-top--3" href="/">
        Go back to VA.gov
      </a>
      <div className="help-footer-box vads-u-margin-top--6">
        <h2 className="help-heading vads-u-font-size--h3">Need help?</h2>
        <p className="help-talk">
          <strong>If you have trouble using this online form,</strong> call us
          at <va-telephone contact="8006982411" /> (
          <va-telephone contact="711" tty />
          ). We&rsquo;re here 24/7.
        </p>
        <p className="help-talk">
          <strong>
            If you need help gathering your information or filling out your
            form,
          </strong>{' '}
          contact a local Veterans Service Organization (VSO).
        </p>
        <va-link
          href="https://www.va.gov/get-help-from-accredited-representative/"
          text="Get help from a VA accredited representative or VSO"
        />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export default ConfirmationPage;
