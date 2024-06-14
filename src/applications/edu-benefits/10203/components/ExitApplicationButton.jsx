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

  return (
    <a
      className="vads-c-action-link--green"
      href="/education/"
      onClick={onClick}
    >
      Exit application
    </a>
  );
};
