import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function EligibilityCheckMessage({ eligibility }) {
  if (!eligibility.requestPastVisit) {
    return (
      <AlertBox
        status="warning"
        headline="Sorry, we couldn't find a recent appointment"
      >
        In order to request an appointment at this facility for the chosen type
        of care, you need to have been seen within the past{' '}
        {eligibility.requestPastVisitValue} months.
      </AlertBox>
    );
  }
  if (!eligibility.requestLimit) {
    return (
      <AlertBox
        status="warning"
        headline="Sorry, you already have an outstanding request"
      >
        You have more outstanding requests than this facility allows for this
        type of care.
      </AlertBox>
    );
  }

  return (
    <AlertBox status="warning" headline="Sorry, something went wrong">
      Sorry, we're having trouble verifying that you can make an appointment at
      this facility. Please try another facility.
    </AlertBox>
  );
}
