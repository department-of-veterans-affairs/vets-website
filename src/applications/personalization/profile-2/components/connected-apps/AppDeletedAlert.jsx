import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const AppDeletedAlert = props => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { id, appName, dismissAlert } = props;
  const alertMessage = `${appName} won’t be able to see any new information
  about you from VA, but may still have access to information that was previously
  shared. To remove any stored data, contact ${appName} and request permanent deletion`;

  return (
    <div tabIndex="-1" data-focus-target>
      <AlertBox
        status="success"
        headline="This app has been disconnected"
        content={alertMessage}
        onCloseAlert={() => dismissAlert(id)}
      />
    </div>
  );
};
