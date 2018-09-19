import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/formation/CollapsiblePanel';

export const claimExamsDescription = (
  <p>
    After we review your disability claim and supporting evidence, we may ask
    you to have a claim exam (also known as a C&P exam) if we need more
    information to decide your claim. We’ll use the results of this exam, in
    addition to your supporting evidence, to rate your disability.
  </p>
);

export const claimExamsFAQ = (
  <div>
    <CollapsiblePanel panelName="Does everyone who files a claim need to have a VA claim exam?">
      <p>
        No. We’ll ask you to have a claim exam only if we need more information
        to decide your claim. If you need to have an exam, you should receive
        your first call within XX days.
      </p>
    </CollapsiblePanel>
    <CollapsiblePanel panelName="How we schedule exams">
      <p>
        The staff at your local VA medical center will contact you to schedule your
        exam. An exam scheduler will make two attempts to contact you by phone to
        find a time that works for you. The phone number they’ll call you from will
        look like this:<br/>
        NNN-NNN-XXXX<br/>
        If they’re unable to reach you by phone, they’ll schedule an appointment
        for you and send you a letter by mail with the date and time of your exam.
      </p>
    </CollapsiblePanel>
    <CollapsiblePanel panelName="What if I need to reschedule my exam appointment?">
      <p>
          If you can’t make it your exam, let us know right away. You can most
          likely reschedule, but this may delay a decision on your claim. If you
          need to reschedule your exam, please call <a href="tel:1-800-827-1000">
          1-800-827-1000</a>.
      </p>
    </CollapsiblePanel>
  </div>
);
