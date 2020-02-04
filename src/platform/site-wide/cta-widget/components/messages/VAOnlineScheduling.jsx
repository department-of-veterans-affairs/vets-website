import React from 'react';
import CallToActionAlert from './../CallToActionAlert';
import { widgetTypes } from '../../helpers';

const headerAndDesc = {
  [widgetTypes.VIEW_APPOINTMENTS]: {
    heading: 'View your VA appointments online',
    alertText: (
      <p>
        <strong>We’ve launched a new online scheduling tool on VA.gov.</strong>
        <br />
        We invite you to try our VA.gov scheduling tool to view your
        appointments online. With this tool, you’ll also be able to see any
        appointments you’ve made through My HealtheVet.
      </p>
    ),
  },
  [widgetTypes.SCHEDULE_APPOINTMENTS]: {
    heading: 'Schedule or cancel a VA appointment online',
    alertText: (
      <p>
        <strong>We’ve launched a new online scheduling tool on VA.gov.</strong>
        <br />
        We invite you to try our VA.gov scheduling tool to schedule or cancel
        your appointments online. With this tool, you’ll also be able to see any
        appointments you’ve made through My HealtheVet.
      </p>
    ),
  },
};

const VAOnlineScheduling = ({ appId }) => {
  const content = {
    ...headerAndDesc[appId],
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
