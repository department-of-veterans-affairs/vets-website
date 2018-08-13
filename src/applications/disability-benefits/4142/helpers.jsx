import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const documentDescription = () => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>
        You said you were treated for [condition] by a private doctor. If you
        have those records, you can upload them here, or we can get them for
        you. If you want us to get your recotds, you'll need to authorize their
        release.
      </p>
    </div>
  );
};

export const letUsKnow = () => {
  return (
    <div>
      <p>
        Please let us know where and when you received treatment. We'll requiest
        your private medical records for you. If you have records available, you
        can upload them later in the application{' '}
      </p>
    </div>
  );
};

export const medicalRecDescription = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h5>Upload your medical records</h5>
    <p>
      If you have an electronic copy of your medical records, uploading your
      records can speed the review of your claim
    </p>
    <p>
      This works best if you have a fast internet connection and time for a
      large file upload. Records should be .pdf, .jpg, or .png files.
    </p>
    <h5>We get records for you</h5>
    <p>
      If you tell us which VA medical center treated you for your condition, we
      can get your medical reocrds for you. Getting your records may take us
      some time. This could take us longer to make a decision on your claim.
    </p>
  </AdditionalInfo>
);

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
