import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export const evidenceTypeHelp = (
  <AdditionalInfo triggerText="Which evidence type should I choose?">
    <h3>Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>
      If you were treated at a VA medical center or clinic, or by a doctor
      through the TRICARE health care program, you’ll have VA medical records.
    </p>
    <h4>Private medical records</h4>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefits
      Questionnaire is an example of a private medical record.
    </p>
    <h4>Lay statements or other evidence</h4>
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

export const noEvidenceDescription = (
  <AlertBox status="info" isVisible>
    <div>
      <p>
        <strong>Please note:</strong> You don’t have to submit evidence for your
        claim, but we recommend that you do provide some supporting information
        related to your claimed disability. If you don’t submit any evidence we
        may schedule a claim exam for you to help us decide your claim.
      </p>
      <p>
        You have up to 1 year from the date we receive your claim to turn in any
        evidence. If you don’t have supporting evidence right now, you can save
        your application and return to it later when your evidence is ready to
        upload.
      </p>
    </div>
  </AlertBox>
);
