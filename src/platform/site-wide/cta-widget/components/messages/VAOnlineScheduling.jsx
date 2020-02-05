import React from 'react';
import CallToActionAlert from './../CallToActionAlert';
import { widgetTypes } from '../../helpers';

const alertText = {
  [widgetTypes.VIEW_APPOINTMENTS]: (
    <p>
      We invite you to try our VA.gov scheduling tool to view your appointments
      online. With this tool, you’ll also be able to see any appointments you’ve
      made through My HealtheVet.
    </p>
  ),
  [widgetTypes.SCHEDULE_APPOINTMENTS]: (
    <p>
      We invite you to try our VA.gov scheduling tool to schedule or cancel your
      appointments online. With this tool, you’ll also be able to see any
      appointments you’ve made through My HealtheVet.
    </p>
  ),
};

const VAOnlineScheduling = ({ appId }) => {
  const content = {
    heading: 'We’ve launched a new online scheduling tool on VA.gov',
    alertText: alertText[appId],
    primaryButtonText: 'Go to VA.gov scheduling tool',
    primaryButtonHandler: () => {
      window.location =
        '/health-care/schedule-view-va-appointments/appointments/';
    },
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

export default VAOnlineScheduling;
