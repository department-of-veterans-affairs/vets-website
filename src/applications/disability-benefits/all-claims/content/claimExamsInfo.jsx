import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/formation/CollapsiblePanel';

export const claimExamsDescription = (
  <div>
    <p>
      After we review your disability claim and supporting evidence, we may ask
      you to have a claim exam (also known as a C&P exam) if we need more
      information to decide your claim. We’ll use the results of this exam, in
      addition to your evidence, to rate your disability and make a decision on
      your claim.
    </p>
    <h4>
      Does everyone who files a disability claim need to have a claim exam?
    </h4>
    <p>
      No. We’ll ask you to have a claim exam only if we need more information to
      decide your claim. If you’ve provided enough supporting evidence for your
      claimed disability, we won’t ask you to have a claim exam.
    </p>
  </div>
);

export const claimExamsFAQ = (
  <div>
    <CollapsiblePanel panelName="How will you contact me if I need to have an exam?">
      <p>
        The staff at your local VA medical center will contact you to schedule
        your exam. They’ll either send you a letter by mail with the date and
        time of your exam, or call you to find a time that works for you.
      </p>
    </CollapsiblePanel>
    <CollapsiblePanel panelName="What if I need to reschedule my exam appointment?">
      <p>
        If you can’t make it to your scheduled exam, let us know right away. You
        can most likely reschedule, but this may delay a decision on your claim.
        If you need to reschedule your exam, please call{' '}
        <a href="tel:1-800-827-1000">1-800-827-1000</a>.
      </p>
    </CollapsiblePanel>
  </div>
);
