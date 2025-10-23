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

const VAOnlineScheduling = props => {
  const {
    vaOnlineSchedulingCommunityCare: featureCommunityCareEnabled,
  } = props.featureToggles;
  const content = {
    heading:
      'Go to the VA appointments tool to view, schedule, or cancel your appointment online',
    alertText: featureCommunityCareEnabled ? alertText : noCCAlertText,
    primaryButtonText: 'Go to your VA appointments',
    primaryButtonHandler: () => {
      window.location = '/my-health/appointments';
    },
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

VAOnlineScheduling.propTypes = {
  featureToggles: PropTypes.object,
};

export default VAOnlineScheduling;
