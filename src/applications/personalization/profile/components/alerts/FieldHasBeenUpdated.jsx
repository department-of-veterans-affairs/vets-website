import React from 'react';

import { useLocation } from 'react-router-dom';

export const FieldHasBeenUpdated = () => {
  const locationState = useLocation().state;
  const { fieldInfo = null } = locationState || {};

  const text = `We saved your ${fieldInfo?.title?.toLowerCase() ||
    `information`} to your profile.`;

  return fieldInfo ? (
    <va-alert
      class="vads-u-margin-bottom--1"
      background-only
      status="success"
      show-icon
    >
      <p className="vads-u-margin-y--0">{text}</p>
    </va-alert>
  ) : null;
};
