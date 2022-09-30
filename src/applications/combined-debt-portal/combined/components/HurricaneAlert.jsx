import React from 'react';

const HurricaneAlert = () => {
  return (
    <va-alert-expandable
      trigger="VA Offers Benefit Debt Relief to Veterans Affected by recent Hurricanes"
      status="info"
    >
      <p>
        Effective September 21, 2022 the Department of Veterans Affairs (VA) is
        offering Veterans and family members affected by Hurricane Fiona or
        Hurricane Ian the option to suspend repayment of their VA benefit debt
        for 90 days.
      </p>
      <p>
        To request a hardship suspension for a benefit debt, Veterans can
        contact the VA Debt Management Center via Ask VA at{' '}
        <a href="https://ask.va.gov">https://ask.va.gov</a> (select "Veterans
        Affairs-Debt" as the category) or call{' '}
        <va-telephone contact="8008270648" />.
      </p>
      <p>
        For medical care and pharmacy copayment debt relief, Veterans and
        beneficiaries can contact the Health Resource Center at{' '}
        <va-telephone contact="8664001238" />.
      </p>
    </va-alert-expandable>
  );
};

export default HurricaneAlert;
