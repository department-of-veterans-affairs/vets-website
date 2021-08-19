import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const evidenceTypeTitle = (
  <h3 className="vads-u-font-size--h4">
    What type of evidence do you want us to review as part of your claim?
  </h3>
);

export const evidenceTypeHelp = (
  <AdditionalInfo triggerText="Which evidence type should I choose?">
    <h4>Types of evidence</h4>
    <h5>Private medical records</h5>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefits
      Questionnaire is an example of a private medical record.
    </p>
    <h5>Lay statements or other evidence</h5>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. But some claims—such as those for
      Posttraumatic Stress Disorder or military sexual trauma—could benefit from
      a lay or buddy statement.
    </p>
  </AdditionalInfo>
);
