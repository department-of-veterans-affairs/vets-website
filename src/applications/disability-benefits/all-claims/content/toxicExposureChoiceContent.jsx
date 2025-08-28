import React from 'react';

export const sectionsOfToxicExposure = [
  'Gulf War service locations and dates (1990 and 2001)',
  'Agent Orange exposure locations and dates',
  'Other toxic exposure details and dates',
];

export const deleteToxicExposureModalTitle =
  'Remove condition related to toxic exposure?';

// TODO: make dynamic based on the TOXIC_EXPOSURE_ALL_KEYS
export const deleteToxicExposureModalDescription =
  "If you choose to remove this as a condition related to toxic exposure, we'll delete information about:";

export const deleteToxicExposureModalContent = (
  <>
    <ul>
      {sectionsOfToxicExposure.map(section => (
        <li key={section}>{section}</li>
      ))}
    </ul>
  </>
);

export const deletedToxicExposureAlertConfirmationContent = (
  <>
    <p className="vads-u-margin-y--0">
      You’ve removed toxic exposure conditions from your claim.
    </p>
    <p className="vads-u-margin-y--0">
      Review your conditions and supporting documents to remove any information
      you don’t want to include.
    </p>
  </>
);
