import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const SeparationLocationTitle = 'Place of anticipated separation';

export const SeparationLocationDescription = (
  <>
    <br />
    <AdditionalInfo triggerText="What's this">
      <>
        <p>
          Your place of anticipated separation is the location where you expect
          to be separated from your military service. Usually, service members
          separate from their last active duty station, or the nearest regional
          facility that handles separation details.
        </p>
        Providing us with the separation location allows us to more easily
        gather details to help process your claim (such as the exact date you
        separated).
      </>
    </AdditionalInfo>
  </>
);
