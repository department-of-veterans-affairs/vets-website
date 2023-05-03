import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

export const EVIDENCE_LABEL = {
  default:
    'Is there any evidence that you’d like us to review as part of your claim?',
  bddSha: 'Do you want to upload any other documents or evidence at this time?',
};

export const HasEvidenceLabel = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isShowBDDSHA = useToggleValue(TOGGLE_NAMES.form526BddSha);
  const content = isShowBDDSHA ? EVIDENCE_LABEL.bddSha : EVIDENCE_LABEL.default;

  return (
    <>
      {content} <span className="schemaform-required-span">(*Required)</span>
    </>
  );
};

export const evidenceTypeTitle = (
  <h3 className="vads-u-font-size--h4">
    What type of evidence do you want to submit as part of your claim?
  </h3>
);

export const privateMedicalRecords = 'Private medical records';

export const EvidenceLayStatements = () => {
  // TODO: use toggle
  // const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  // const isShowBDDSHA = useToggleValue(TOGGLE_NAMES.form526BddSha);

  // if (isShowBDDSHA) {
  if (!environment.isProduction()) {
    return (
      <>
        <strong>
          Required Separation Health Assessment - Part A Self-Assessment
        </strong>{' '}
        or other documents like your DD214, supporting (lay) statements, or
        other evidence
      </>
    );
  }
  return (
    <>
      Additional VA forms, medical records, separation documents (DD Form 214),
      supporting (lay) statements, or other evidence
    </>
  );
};

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
