import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const alertText = (
  <p>
    You’ll be able to manage and see all your appointments in one place on
    VA.gov. You can also schedule or cancel some VA and Community Care
    appointments online.
  </p>
);

const noCCAlertText = (
  <p>
    You’ll be able to manage and see all your appointments in one place on
    VA.gov. You can also schedule or cancel some VA appointments online.
  </p>
);

const VAOnlineScheduling = ({ isCommunityCareEnabled }) => {
  const content = {
    heading:
      'Go to the VA appointments tool to view, schedule, or cancel your appointment online',
    alertText: isCommunityCareEnabled ? alertText : noCCAlertText,
    primaryButtonText: 'Go to your VA appointments',
    primaryButtonHandler: () => {
      window.location.assign(
        '/health-care/schedule-view-va-appointments/appointments?redirect=false',
      );
    },
    status: 'info',
  };

  // Change the address bar to the VAOS homepage url
  window.history.pushState(
    {},
    '',
    '/health-care/schedule-view-va-appointments',
  );

  return <CallToActionAlert {...content} />;
};

VAOnlineScheduling.propTypes = {
  isCommunityCareEnabled: PropTypes.bool.isRequired,
};

export default VAOnlineScheduling;
