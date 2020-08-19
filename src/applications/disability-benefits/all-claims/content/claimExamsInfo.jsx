import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import CollapsiblePanel from '@department-of-veterans-affairs/formation-react/CollapsiblePanel';

export const claimExamsDescription = (
  <div>
    <p>
      After we review your disability claim and supporting evidence, we may ask
      you to have a claim exam (also known as a C&amp;P exam) if we need more
      information to decide your claim.
    </p>
    <AlertBox
      headline="You might receive a phone call from an unfamiliar number to schedule your exam"
      content="You’ll receive a phone call from a VA third-party vendor or from VA to schedule your exam. It’s important that you answer any calls you receive after you file a disability claim."
      status="warning"
    />
    <p>At this time we partner with 3 vendors:</p>
    <ul>
      <li>QTC Medical Services (QTC)</li>
      <li>Veterans Evaluation Services (VES)</li>
      <li>Logistics Health Inc. (LHI)</li>
    </ul>
  </div>
);

export const claimExamsFAQ = (
  <>
    <h3 className="vads-u-font-size--h4">More information about claim exams</h3>
    <CollapsiblePanel panelName="What happens if I miss a phone call?">
      <p>
        If we’re unable to reach you by phone, we’ll schedule an appointment for
        you and send you a letter with the date and time of your exam.
      </p>
      <p>
        Please call the number provided on your appointment letter to confirm
        your exam time and location.
      </p>
    </CollapsiblePanel>
    <CollapsiblePanel panelName="Why do I need a claim exam?">
      <p>
        Not everyone who files a disability claim will need an exam. We’ll ask
        you to have an exam only if we need more information to decide your
        claim and to help us rate your disability.
      </p>
    </CollapsiblePanel>
  </>
);
