import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const otherSourcesDescription = (
  <div>
    <h3>Other sources of information</h3>
    <p>
      If you were treated at a military or private facility for this event, or
      reported the event to the authorities or other parties, we can help you
      gather supporting information from them for your claim.
    </p>
    <p>
      If you have supporting (lay) statements from friends, family, or clergy,
      or have copies of reports from authorities, you’ll be able to upload those
      later in the application.
    </p>
  </div>
);

export const otherSourcesHelpText = (
  <AdditionalInfo triggerText="Which should I choose">
    <h5>
      Choose "Yes" if you’d like help getting private medical treatment records
      or statements from military authorities
    </h5>
    <p>
      You’ll need to give us permission to request your medical records from
      private health care providers and counselors. You’ll have a chance to do
      this later in the application.
    </p>
    <p>
      We can request statements or reports you made to military or civilian
      authorities about the event. We’ll need their name and contact
      information, if you have them, to request relevant documents on your
      behalf.
    </p>
    <h5>
      Choose "No" if you don’t need help getting this evidence for your claim
    </h5>
    <p>
      If you don’t need help getting supporting documents or reports, you’ll
      have a chance to upload them later in the application.
    </p>
  </AdditionalInfo>
);
