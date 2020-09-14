import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const alertContent = (
  <>
    <p>
      Your eligibility for the BDD program could expire if there is a delay in
      getting your service treatment records.
    </p>
    <p>
      You don't have to turn in your records now, but we recommend that you
      submit them with this application. If you decide to submit them later,
      please do so as soon as possible.
    </p>
  </>
);

export const serviceTreatmentRecordsSubmitLater = (
  <div className="service-treatment-records-submit-later">
    <AlertBox
      headline="We recommend you submit your service treatment records"
      content={alertContent}
      status="warning"
    />
  </div>
);
