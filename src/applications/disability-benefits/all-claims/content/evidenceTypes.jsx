import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

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
      records to make a decision on your claim. A Disability Benefit
      Questionnaire is an example of a private medical record.
    </p>
    <h4>Lay statements or other evidence</h4>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. Some claims, for example, for Posttraumatic
      Stress Disorder or for military sexual trauma, could benefit from a lay or
      buddy statement.
    </p>
  </AdditionalInfo>
);

export const noEvidenceDescription = (
  <p>
    <strong>Please note,</strong> while you don’t have to submit evidence for
    your claim, we recommend that you do provide supporting information that
    relates to your claimed disability. If you don’t provide any supporting
    information, we may schedule a claim exam for you to help us decide your
    claim. You have up to 1 year from the date we receive your claim to turn in
    any evidence. If you don’t have supporting evidence right now, you can save
    your application and return to it later when you have your evidence ready to
    upload.
  </p>
);
