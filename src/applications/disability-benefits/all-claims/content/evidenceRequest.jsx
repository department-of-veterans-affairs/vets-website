import React from 'react';

export const evidenceRequestAdditionalInfo = (
  <va-additional-info trigger="The differences between VA and private medical centers">
    <p>
      <strong>VA medical centers</strong> include VA medical centers or clinics,
      as well as doctors through the TRICARE health care program.
    </p>
    <p>
      <strong>Private medical centers</strong> include private doctors, such as
      Veterans Choice doctor. You can also choose to upload copies of your
      medical records instead of giving us permission to request them.
    </p>
  </va-additional-info>
);

export const evidenceRequestQuestion = {
  label:
    'Are there medical records related to your claim that you’d like us to access on your behalf from VA or private medical centers?',
  hint: 'If you select “Yes,” we’ll request these records from VA or private medical centers. Or you can upload copies of your private medical records.',
};

export const vaEvidenceContent = (
  <p>
    You can choose not to submit medical records to support your claim. If you
    do so, we’ll remove the information you shared about these VA medical
    centers:
  </p>
);

export const privateEvidenceContent = (
  <p>
    We’ll also delete these medical records you uploaded related to your claimed
    conditions:
  </p>
);

export const privateFacilityContent = (
  <p>
    You can choose not to submit medical records to support your claim. If you
    do so, we’ll remove the information you shared about these private medical
    centers:
  </p>
);

export const alertMessageForCentersAndFiles =
  'We’ve removed information about your medical centers and deleted the medical records you uploaded from this claim.';

export const alertMessageForCenters =
  'We’ve removed information about your medical centers from this claim.';

export const alertMessageForFiles =
  'We’ve deleted the medical records you uploaded from this claim.';
