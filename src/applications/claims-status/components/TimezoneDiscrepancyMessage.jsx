import React from 'react';
import { getTimezoneDiscrepancyMessage } from '../utils/helpers';

// Displays timezone warning message for file uploads near midnight
export default function TimezoneDiscrepancyMessage() {
  const message = getTimezoneDiscrepancyMessage(new Date().getTimezoneOffset());

  if (!message) {
    return null;
  }

  return (
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--3 vads-u-color--gray-medium">
      {message}
    </p>
  );
}
