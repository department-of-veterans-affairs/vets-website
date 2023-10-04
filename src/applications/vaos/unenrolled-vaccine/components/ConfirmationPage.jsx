import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event.js';
import InfoAlert from '../../components/InfoAlert';
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
      <InfoAlert status="success">
        <strong>Your appointment is confirmed.</strong>
        <p>
          If you get a vaccine that requires a second dose, we'll schedule your
          second appointment while you're here for your first dose.
        </p>
      </InfoAlert>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <span className="vads-u-margin-y--0 vaos-u-text-transform--uppercase">
          {appointmentType}
        </span>
        <br />
      </div>
      <div className="vads-u-margin-y--2">
        <va-link
          href="/my-health/appointments/"
          text="Review your appointments"
          className="usa-button vads-u-padding-right--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
            });
          }}
        />
      </div>
    </div>
  );
}
