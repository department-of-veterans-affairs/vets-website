import React from 'react';

export const ExposureCategoriesLink = (
  <p>
    <a
      target="_blank"
      rel="noreferrer"
      href="https://www.publichealth.va.gov/exposures/index.asp"
    >
      Find more military exposure categories on our Public Health website (opens
      in new tab)
    </a>
  </p>
);

export const OtherExposureDescription = (
  <>
    <p>
      We want to know about any other toxins or other hazards you think you may
      have been exposed to while deployed or during training or active duty
      service.
    </p>
    {ExposureCategoriesLink}
    <p>
      Note: If you’re not sure, you can still select any of the toxins or
      hazards listed here. This may help us find information about your service
      history and confirm whether you may have been exposed to any toxins or
      other hazards.
    </p>
    <p>
      Do you think you may have been exposed to any of these toxins or hazards
      while deployed or during training or active duty service? Select any you
      think you may have been exposed to.
    </p>
  </>
);
