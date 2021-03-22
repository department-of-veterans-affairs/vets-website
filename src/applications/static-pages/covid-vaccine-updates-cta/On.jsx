import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import { connect } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import recordEvent from 'platform/monitoring/record-event';
import { rootUrl as covidVaccineFormUrl } from 'applications/coronavirus-vaccination/manifest.json';

const recordButtonClick = buttonClickLabel => {
  recordEvent({
    event: 'cta-button-click',
    buttonType: 'primary',
    buttonClickLabel,
    buttonBackgroundColor: '#0071bb',
  });
};

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

            {copy.expandedEligibilityContent ? (
              <ul>
                <li>
                  <strong>
                    {copy.expandedEligibilityContent.veteran.boldedNote}
                  </strong>
                  {copy.expandedEligibilityContent.veteran.body}
                </li>
                <li>
                  <strong>
                    {copy.expandedEligibilityContent.nonVeteran.boldedNote}
                  </strong>
                  {copy.expandedEligibilityContent.nonVeteran.body}
                </li>
              </ul>
            ) : (
              ''
            )}

            {copy.body ? <p>{copy.body}</p> : ''}
            <p>
              {copy.boldedNote ? <strong>{copy.boldedNote} </strong> : ''}
              {copy.note ? copy.note : ''}
            </p>

            <DowntimeNotification
              dependencies={[externalServices.vetextVaccine]}
              render={(downtime, children) => {
                if (downtime.status === 'down') {
                  return (
                    <button
                      onClick={() => {
                        recordButtonClick(copy.buttonText);
                      }}
                      disabled
                    >
                      {copy.buttonText}
                    </button>
                  );
                }
                return children; // Render normal enabled button
              }}
            >
              <a
                onClick={() => {
                  recordButtonClick(copy.buttonText);
                }}
                href={covidVaccineFormUrl}
                className="usa-button-primary"
              >
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
