import React from 'react';

/**
 * GetHelp component for VA Form 21-2680
 * Displays contact information for assistance with Aid and Attendance or Housebound benefits
 * @returns {JSX.Element} Help contact information component
 */
export const GetHelp = () => (
  <div>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
      <strong>If you have trouble using this online form</strong>, call our
      MyVA411 main information line at <va-telephone contact="8006982411" /> (
      <va-telephone contact="711" tty />
      ). We’re here 24/7.
    </p>
  </div>
);
