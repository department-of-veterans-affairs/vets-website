import React from 'react';
import { useSelector } from 'react-redux';

export default function WarningBanner() {
  const formData = useSelector(state => state.form?.data || {});
  const details = formData?.institutionDetails || {};
  const notYR = details.yrEligible === false;
  const notIHL = details.ihlEligible === false;

  let message = '';

  if (!notYR && !notIHL) {
    return null;
  }

  // All those that are not yrEligible also do not have IHL in programTypes
  if (notYR) {
    message =
      'This institution is unable to participate in the Yellow Ribbon Program. You can enter a main or branch campus facility code to continue.';
  }

  if (!notYR && notIHL) {
    message =
      'This institution is unable to participate in the Yellow Ribbon Program.';
  }

  return (
    <va-alert
      className="vads-u-margin-top--2"
      status="error"
      visible
      background-only
    >
      <p className="vads-u-margin--0">{message}</p>
    </va-alert>
  );
}
