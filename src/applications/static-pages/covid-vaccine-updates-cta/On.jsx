import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

import { rootUrl as covidVaccineFormUrl } from 'applications/coronavirus-vaccination/manifest.json';

export default function OnState() {
  return (
    <AlertBox
      status={ALERT_TYPE.INFO}
      headline="Stay informed and help us prepare"
      content={
        <>
          <p>
            Sign up for an easy way to stay informed about our COVID-19 plans.
          </p>
          <p>
            When you sign up, we'll also ask about your interest in getting a
            vaccine when one is available to you. By sharing your interest, you
            can help us better prepare as we work to offer vaccines to more
            Veterans.
          </p>
          <p>
            <strong>Note:</strong> You don’t need to sign up to get a vaccine.
          </p>
          <a href={covidVaccineFormUrl} className="usa-button-primary">
            Sign up to stay informed
          </a>
        </>
      }
    />
  );
}
