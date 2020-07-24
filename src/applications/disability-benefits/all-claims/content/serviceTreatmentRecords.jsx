import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const serviceTreatmentRecordsSubmitLater = (
  <div className="service-treatment-records-submit-later">
    <AlertBox
      headline="We recommend submitting your Service Treatment Records as soon as possible."
      content="It is not required that you submit your Service Treatment Records with this application - you are able to submit them after filing. However, a delay in receiving your records may cause you to fall out of the eligibility window (180 - 90 days from separation) for the Benefits Delivery at Discharge program."
      status="warning"
    />
  </div>
);
