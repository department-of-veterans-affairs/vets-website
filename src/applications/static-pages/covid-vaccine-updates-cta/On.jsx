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

function OnState({ copy }) {
  return (
    <>
      <DowntimeNotification
        dependencies={[externalServices.vetextVaccine]}
        appTitle={copy.appTitle}
      >
        <div />
      </DowntimeNotification>
      <AlertBox
        status={ALERT_TYPE.INFO}
        headline={copy.headline}
        content={
          <>
            <p>{copy.cta}</p>
            <p>{copy.body}</p>
            <p>
              {' '}
              {copy.boldedNote ? <strong>{copy.boldedNote} </strong> : ''}
              {copy.note}
            </p>
            <DowntimeNotification
              dependencies={[externalServices.vetextVaccine]}
              render={(downtime, children) => {
                if (downtime.status === 'down') {
                  return <button disabled>{copy.buttonText}</button>;
                }
                return children; // Render normal enabled button
              }}
            >
              <a href={covidVaccineFormUrl} className="usa-button-primary">
                {copy.buttonText}
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
