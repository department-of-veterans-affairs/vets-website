import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const AppDeletedAlert = ({
  dismissAlert,
  id,
  privacyPolicies,
  title,
}) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);
  const privacyLink = (
    <a
      href={`${privacyPolicies[title]}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      privacy policy
    </a>
  );
  const alertMessage = (
    <span>
      We’ve disconnected {title}. This app can’t access any new information from
      your VA.gov profile, but{' '}
      <strong>
        some apps may still store information you’ve already shared.
      </strong>{' '}
      To learn about how this app stores your information, including what
      information it stores, if any, and what steps are available to you, review{' '}
      {title}
      's {privacyLink}.
    </span>
  );
  const headline = `We’ve disconnected ${title}`;
  return (
    <div tabIndex="-1" data-focus-target className="vads-u-margin-y--4">
      <AlertBox
        status="success"
        headline={headline}
        content={alertMessage}
        onCloseAlert={() => dismissAlert(id)}
      />
    </div>
  );
};

AppDeletedAlert.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dismissAlert: PropTypes.func.isRequired,
  privacyPolicies: PropTypes.object.isRequired,
};
