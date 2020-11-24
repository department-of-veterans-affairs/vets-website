import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const alertContent = (
  <>
    <p>
      Your eligibility for the BDD program could expire if there is a delay in
      getting your service treatment records.
    </p>
    <p>
      While you don’t have to turn them in now, please submit them as soon as
      you can.
    </p>
  </>
);

export const serviceTreatmentRecordsSubmitLater = (
  <div className="service-treatment-records-submit-later">
    <AlertBox
      headline="Please submit your service treatment records as soon as possible"
      content={alertContent}
      status="warning"
    />
  </div>
);
