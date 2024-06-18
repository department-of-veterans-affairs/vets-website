import React from 'react';
import SecondaryCaregiverDescription from './SecondaryCaregiverDescription';

export const SecondayCaregiverOneIntro = (
  <>
    <p>
      You can use this application to apply for benefits for a Secondary Family
      Caregiver.
    </p>
    <p>
      <strong>Note:</strong> There can only be 2 Secondary Family Caregivers at
      any one time.
    </p>
    {SecondaryCaregiverDescription}
  </>
);

export const SecondayCaregiverTwoIntro = (
  <>
    <p>You can have up to 2 Secondary Family Caregivers at any one time.</p>
    {SecondaryCaregiverDescription}
  </>
);
