import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const SeparationLocationTitle = 'Place of anticipated separation';

export const SeparationLocationDescription = (
  <>
    <br />
    <AdditionalInfo triggerText="What's this?">
      <>
        <p>
          Your place of anticipated separation is where you expect to separate
          from military service. This could be your last active-duty base or the
          nearest regional facility that handles separations.
        </p>
        <p>
          We ask for this location so we can more easily gather details, such as
          your exact separation date, to help process your claim.
        </p>
        <b>
          If you can't find your exact location from the list, please select
          your nearest regional facility.
        </b>
      </>
    </AdditionalInfo>
  </>
);
