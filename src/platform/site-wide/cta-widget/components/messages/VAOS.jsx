import React from 'react';
import CallToActionAlert from './../CallToActionAlert';

const VAOSCTAContent = ({ serviceDescription }) => {
  const content = {
    heading: `Check out the new Veteran Online Appointment Scheduling Tool (VAOS)`,
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
    secondaryButtonText: 'Take me to the old tool',
    secondaryButtonHandler: () => {
      // not sure yet how to do this, as we would have to refresh the cta widget
      // and force the mhv/mvi checks
    },
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

export default VAOSCTAContent;
