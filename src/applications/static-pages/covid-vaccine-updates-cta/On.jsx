import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import { connect } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { rootUrl as covidVaccineFormUrl } from 'applications/coronavirus-vaccination/manifest.json';

const buttonText = 'Sign up to stay informed';

function renderDowntime(downtime, children) {
  if (downtime.status === 'down') {
    return <button disabled>{buttonText}</button>;
  }
  return children; // Render normal enabled button
}

function OnState() {
  return (
    <>
      <DowntimeNotification
        dependencies={[externalServices.vetextVaccine]}
        appTitle="Covid 19 Vaccination Information"
      >
        <div />
      </DowntimeNotification>
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
              vaccine when one is available to you. By sharing your interest,
              you can help us better prepare as we work to offer vaccines to
              more Veterans.
            </p>
            <p>
              <strong>Note:</strong> You don’t need to sign up to get a vaccine.
            </p>
            <DowntimeNotification
              dependencies={[externalServices.vetextVaccine]}
              render={renderDowntime}
            >
              <a href={covidVaccineFormUrl} className="usa-button-primary">
                {buttonText}
              </a>
            </DowntimeNotification>
          </>
        }
      />
    </>
  );
}
export default connect()(OnState);
export { OnState };
