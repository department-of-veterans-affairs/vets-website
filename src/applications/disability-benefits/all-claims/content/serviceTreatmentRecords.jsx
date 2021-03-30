import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const alertContent = (
  <p>
    You don’t have to turn in your service treatment records with your
    application, but your eligibility for the BDD program could expire if there
    is a delay in us receiving them.
  </p>
);

export const serviceTreatmentRecordsSubmitLater = (
  <div id="submit-str-asap" className="service-treatment-records-submit-later">
    <AlertBox
      headline="Please submit your service treatment records as soon as possible"
      content={alertContent}
      status="warning"
    />
  </div>
);
