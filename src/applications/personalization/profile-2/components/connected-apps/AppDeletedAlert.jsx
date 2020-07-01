import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const AppDeletedAlert = props => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { id, title, dismissAlert } = props;
  const alertMessage = `We’ve disconnected ${title}. This app can’t access any new information from your VA.gov profile. Some apps may still store information you’ve already shared. If you’d like to ask the app to delete any stored information, contact the app’s support.`;
  const headline = `We’ve disconnected ${title}`;
  return (
    <div tabIndex="-1" data-focus-target>
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
};
