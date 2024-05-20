import React from 'react';

export const evidenceTypeTitle = (
  <h3 className="vads-u-font-size--h4">
    What type of evidence do you want to submit as part of your claim?
  </h3>
);

export const privateMedicalRecords = 'Private medical records';

export const bddShaOtherEvidence =
  'Required Separation Health Assessment - Part A Self-Assessment or other documents like your DD Form 214, supporting (lay) statements, or other evidence';

export const defaultOtherEvidence = (
  <>
    Additional VA forms, medical records, separation documents (DD Form 214),
    supporting (lay) statements, or other evidence
  </>
);

export const evidenceTypeError =
  'Please select at least one type of supporting evidence';

export const evidenceTypeHelp = (
  <va-additional-info trigger="Which evidence type should I choose?">
    <h4>Types of evidence</h4>
    <h5 className="vads-u-padding-top--1p5">
      Required Separation Health Assessment - Part A Self-Assessment
    </h5>
    <p>
      You’ll need to submit your completed Separation Health Assessment - Part A
      Self-Assessment so we can request your VA exams.
    </p>
    <h5 className="vads-u-padding-top--1p5">Private medical records</h5>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefits
      Questionnaire is an example of a private medical record.
    </p>
    <h5 className="vads-u-padding-top--1">Lay statements or other evidence</h5>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. But some claims—such as those for
      Posttraumatic Stress Disorder or military sexual trauma—could benefit from
      a lay or buddy statement.
    </p>
  </va-additional-info>
);
