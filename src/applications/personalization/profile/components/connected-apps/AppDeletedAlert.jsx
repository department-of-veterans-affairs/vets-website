import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const AppDeletedAlert = props => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { id, title, dismissAlert, privacyUrl } = props;
  const privacyLink = (
    <a
      href={privacyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} privacy policy`}
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
      information it stores, if any, and what steps are available to you, review
      the {title} {privacyLink}.
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
  privacyUrl: PropTypes.string.isRequired,
};
