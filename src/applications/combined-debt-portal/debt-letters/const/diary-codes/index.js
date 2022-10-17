import React from 'react';

export const renderLetterHistory = diaryCode => {
  switch (diaryCode) {
    case '100':
    case '101':
    case '102':
    case '109':
      return (
        <>
          <p className="vads-u-margin--0">
            <strong>First demand letter</strong>
          </p>
          <p className="vads-u-margin--0">
            A letter was sent to notify you of your debt and provide information
            on how to resolve it.
          </p>
        </>
      );
    case '117':
      return (
        <>
          <p className="vads-u-margin--0">
            <strong>Second demand letter</strong>
          </p>
          <p className="vads-u-margin--0">
            A letter was sent to inform you that failure to pay or contact the
            DMC within 60 days would result in the debt being reported to Credit
            Reporting Agencies.
          </p>
        </>
      );
    case '123':
      return (
        <>
          <p className="vads-u-margin--0">
            <strong>Third demand letter</strong>
          </p>
          <p className="vads-u-margin--0">
            A letter was sent to inform you that failure to pay or contact the
            DMC within 30 days would result in the debt being referred to the
            Department of Treasury for collection. This referral could result in
            your state or federal payments being withheld.
          </p>
        </>
      );
    case '130':
      return (
        <>
          <p className="vads-u-margin--0">
            <strong>Debt increase letter</strong>
          </p>
          <p className="vads-u-margin--0">
            A letter was sent to inform you that your debt’s balance has
            increased due to additional benefit over payments being made to you.
          </p>
        </>
      );
    default:
      return null;
  }
};
