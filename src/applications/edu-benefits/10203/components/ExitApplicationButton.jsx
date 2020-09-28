import { apiRequest } from 'platform/utilities/api';
import React from 'react';
import captureEvents from '../analytics-functions';

export const ExitApplicationButton = () => {
  const onClick = () => {
    captureEvents.exitApplication();

    apiRequest('/in_progress_forms/destroy/10203')
      .then(_response => {
        // console.log(`Successfully deleted in progress form 10203: ${response}`);
      })
      .catch(_error => {
        // console.warn(`Failed to delete in progress form 10203: ${error}`);
      });
  };

  return (
    <a
      className={'usa-button-primary va-button-primary'}
      href="/education/"
      onClick={onClick}
      target="_blank"
    >
      Exit application
    </a>
  );
};
