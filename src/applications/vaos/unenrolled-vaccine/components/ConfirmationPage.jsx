import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { GA_PREFIX } from '../../utils/constants.js';

const pageTitle = 'We’ve scheduled your appointment';

export default function ConfirmationPage() {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  // if (submitStatus !== FETCH_STATUS.succeeded) {
  //   return <Redirect to="/" />;
  // }

  const appointmentType = 'COVID-19 Vaccine';

  return (
    <div>
      <h1>{pageTitle}</h1>
      <AlertBox status="success">
        <strong>Your appointment is confirmed.</strong>
        <p>
          If you get a vaccine that requires a second dose, we'll schedule your
          second appointment while you're here for your first dose.
        </p>
      </AlertBox>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <span className="vads-u-margin-y--0 vaos-u-text-transform--uppercase">
          {appointmentType}
        </span>
        <br />
      </div>
      <div className="vads-u-margin-y--2">
        <Link
          to="/"
          className="usa-button vads-u-padding-right--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
            });
          }}
        >
          View your appointments
        </Link>
      </div>
    </div>
  );
}
