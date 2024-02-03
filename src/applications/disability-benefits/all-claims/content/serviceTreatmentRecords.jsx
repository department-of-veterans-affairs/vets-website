import React from 'react';

const alertContent = (
  <p className="vads-u-font-size--base">
    You don’t have to turn in your service treatment records with your
    application, but your eligibility for the BDD program could expire if there
    is a delay in us receiving them.
  </p>
);

export const serviceTreatmentRecordsSubmitLater = (
  <div id="submit-str-asap" className="service-treatment-records-submit-later">
    <va-alert status="warning" uswds>
      <h3 slot="headline">
        Please submit your service treatment records as soon as possible
      </h3>
      {alertContent}
    </va-alert>
  </div>
);
