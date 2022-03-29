/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';

export default function LimitedHours() {
  return (
    <va-alert
      background-only
      show-icon
      status="warning"
      visible
      data-testid="limited-message"
    >
      <div tabIndex={0} id="message">
        Limited services and hours
      </div>
    </va-alert>
  );
}
