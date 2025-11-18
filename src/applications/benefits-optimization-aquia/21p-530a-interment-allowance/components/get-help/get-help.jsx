import React from 'react';

/**
 * GetHelp component for VA Form 21P-530a
 * Displays contact information for assistance with the interment allowance application
 * @returns {JSX.Element} Help contact information component
 */
export const GetHelp = () => (
  <div className="help-footer-box">
    <p>
      <strong>If you have trouble using this online form</strong>, call our
      MyVA411 main information line at <va-telephone contact="8006982411" /> (
      <va-telephone contact="711" tty />
      ). We’re here 24/7.
    </p>
  </div>
);
