import React from 'react';

export const deleteToxicExposureModalTitle =
  'Remove condition related to toxic exposure?';

export const deleteToxicExposureModalDescription =
  "If you choose to remove flat feet as a condition related to toxic exposure, we'll delete information about:";

export const deleteToxicExposureModalContent = (
  <>
    <ul>
      <li>Gulf War service locations and dates (1990 and 2001)</li>
      <li>Agent Orange exposure locations and dates</li>
      <li>Other toxic exposure details and dates</li>
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
