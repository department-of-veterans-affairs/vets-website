import React from 'react';
import CallToActionAlert from './../CallToActionAlert';

const VAOnlineScheduling = ({ serviceDescription }) => {
  const content = {
    heading: `Check out the new Veteran Appointment Online Scheduling Tool (VAOS)`,
    alertText: (
      <p>
        We’re working on a new tool to improve your appointment scheduling
        experience. Click the button below to {serviceDescription}.
      </p>
    ),
    primaryButtonText: 'Go to VAOS',
    primaryButtonHandler: () => {
      window.location =
        '/health-care/schedule-view-va-appointments/appointments/';
    },
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

export default VAOnlineScheduling;
