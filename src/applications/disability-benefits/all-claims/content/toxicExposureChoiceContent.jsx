import React from 'react';

export const deleteToxicExposureModalTitle =
  'Remove toxic exposure conditions from your claim?';

export const deleteToxicExposureModalDescription =
  "If you choose to not claim any conditions related to toxic exposure, we'll delete this information from your claim:";

export const deleteToxicExposureModalContent = (
  <>
    <ul>
      <li>
        <strong>Toxic exposure conditions</strong>
      </li>
      <li>
        <strong>Gulf War service locations and dates (1990 and 2001)</strong>
      </li>
      <li>
        <strong>Agent Orange exposure locations and dates</strong>
      </li>
      <li>
        <strong>Other toxic exposure details and dates</strong>
      </li>
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
