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
        headline="Stay informed about getting a COVID-19 vaccine"
        content={
          <>
            <p>
              Sign up for an easy way to stay informed about getting a COVID-19
              vaccine at VA.
            </p>
            <p>
              When you sign up, we’ll also ask about your vaccine plans. Your
              local VA health facility may use this information to determine
              when to contact you once your risk group becomes eligible.
            </p>
            <p>
              <strong>Note:</strong> We’ll contact every eligible Veteran in
              each risk group. You don’t need to sign up to get a vaccine.
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
