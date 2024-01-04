import React from 'react';
import captureEvents from '../analytics-functions';
import { removeFormApi } from 'platform/forms/save-in-progress/api';

export const ExitApplicationButton = ({ formId, isLoggedIn }) => {
  const onClick = () => {
    captureEvents.exitApplication();

    if (isLoggedIn) {
      removeFormApi(formId);
    }
  };

  return (
    <a href="/education/" onClick={onClick}>
      Exit application
    </a>
  );
};
