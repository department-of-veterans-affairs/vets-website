import React from 'react';
import { useSelector } from 'react-redux';

export default function WarningBanner() {
  const formData = useSelector(state => state.form?.data || {});
  const details = formData?.institutionDetails || {};
  const notYR = details.yrEligible === false;
  const notIHL = details.ihlEligible === false;

  let message = '';
  const code = details.facilityCode;
  const badFormat = code.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const thirdChar = code.charAt(2).toUpperCase();

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

  const hasXInThirdPosition =
    code.length === 8 && !badFormat && thirdChar === 'X';

  if (hasXInThirdPosition) {
    message =
      "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.";
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
