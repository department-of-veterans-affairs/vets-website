import React from 'react';
import { removeFormApi } from 'platform/forms/save-in-progress/api';
import captureEvents from '../analytics-functions';

export const ExitApplicationButton = ({ formId, isLoggedIn }) => {
  const onClick = () => {
    captureEvents.exitApplication();

    if (isLoggedIn) {
      removeFormApi(formId);
    }
  };

  return <va-button onClick={onClick} text="Exit application" />;
};
