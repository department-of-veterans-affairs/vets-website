import React from 'react';
import CallToActionAlert from './../CallToActionAlert';

const alertText = (
  <p>
    You’ll be able to manage and see all your appointments in one place on
    VA.gov. You can also schedule or cancel some VA and Community Care
    appointments online.
  </p>
);

const VAOnlineScheduling = () => {
  const content = {
    heading:
      'Go to the VA appointments tool to view, schedule, or cancel your appointment online',
    alertText,
    primaryButtonText: 'Go to your VA appointments',
    primaryButtonHandler: () => {
      window.location =
        '/health-care/schedule-view-va-appointments/appointments/';
    },
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

export default VAOnlineScheduling;
