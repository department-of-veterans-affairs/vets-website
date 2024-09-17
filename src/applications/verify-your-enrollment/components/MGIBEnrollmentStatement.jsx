import React from 'react';
import VyeOmbInfo from './VyeOmbInfo';

const MGIBEnrollmentStatement = () => {
  return (
    <div id="montgomery-gi-bill-enrollment-statement">
      <h1>Montgomery GI Bill enrollment verification</h1>

      <p className="va-introtext">
        If you’re currently using Montgomery GI Bill benefits, you’ll need to
        verify your enrollment after each month to receive payments.
      </p>
      <VyeOmbInfo />
    </div>
  );
};

export default MGIBEnrollmentStatement;
