import React from 'react';
import captureEvents from '../analytics-functions';
import { removeFormApi } from 'platform/forms/save-in-progress/api';
import environment from 'platform/utilities/environment';

export const ExitApplicationButton = ({ formId, isLoggedIn }) => {
  const onClick = () => {
    captureEvents.exitApplication();

    if (isLoggedIn && !environment.isProduction()) {
      removeFormApi(formId);
    }
  };

  return (
    <a
      className={'usa-button-primary va-button-primary'}
      href="/education/"
      onClick={onClick}
    >
      Exit application
    </a>
  );
};
