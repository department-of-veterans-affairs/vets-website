import React from 'react';

export const doesLiveTogether = formData =>
  formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran === false;

export const liveWithYouTitle = (
  <>
    Does <strong>your spouse</strong> live with you?
  </>
);
