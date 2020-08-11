import React from 'react';
import PropTypes from 'prop-types';
import { selectShowProfile2 } from 'applications/personalization/profile-2/selectors';

import CallToActionAlert from '../CallToActionAlert';

function goToOriginalProfile() {
  window.location = '/profile/';
}

const ChangeAddress = ({
  serviceDescription,
  primaryButtonHandler,
  featureToggles,
}) => {
  const showProfile2 = selectShowProfile2({ featureToggles });

  const content = {
    heading: `Go to your VA.gov profile to ${serviceDescription}`,
    alertText: (
      <p>
        You’ll find your mailing and home address in your profile’s{' '}
        <strong>Personal and contact information</strong> section.
      </p>
    ),
    primaryButtonText: 'Go to your VA.gov profile',
    primaryButtonHandler: showProfile2
      ? primaryButtonHandler
      : goToOriginalProfile,
    status: 'continue',
  };

  return <CallToActionAlert {...content} />;
};

ChangeAddress.propTypes = {
  serviceDescription: PropTypes.string.isRequired,
  primaryButtonHandler: PropTypes.func.isRequired,
  featureToggles: PropTypes.object.isRequired,
};

export default ChangeAddress;
