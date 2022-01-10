import React, { useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const AnalyticsOptOut = () => {
  const gaProperty = 'UA-XXXX-Y';
  const disableStr = `ga-disable-${gaProperty}`;
  const [optedOut, setOptedOut] = useState(
    document.cookie.indexOf(`${disableStr}=true`) > -1,
  );

  const gaOptOut = () => {
    // set cookie, and window variable as per google documentation, set optedOut state to true
    // console.log('GA opt-out fired');
    document.cookie = `${disableStr}=true;`;
    window[disableStr] = true;
    setOptedOut(true);
  };

  const handleOptOut = () => {
    // record event and run opt out
    recordEvent({ event: 'analytics-opt-out', 'internal-user': 'true' });
    gaOptOut();
  };

  return (
    <div>
      <div className="main home" role="main">
        <div className="section main-menu">
          <div className="row">
            <div className="small-12 columns">
              <div style={{ padding: '2em 0' }}>
                <h3>Analytics Opt-out</h3>
                <h4>
                  Click the below button to opt out of the VA.gov Google
                  Analytics collection.
                </h4>
                <p>
                  This opt-out will endure for this device/browser combination
                  as long as you do not remove/reset your cookies. If you use
                  multiple browsers or devices, you will need to opt out once
                  for each device/browser combination to fully exclude yourself.
                </p>
                <p>
                  The intended use case of this opt-out is for VA.gov team
                  members performing testing or validation in the production
                  environment with their personal devices. Other uses are not
                  recommended. The only way to re-enable VA.gov Google Analytics
                  collection is to clear the browser cookies. Therefore, this is
                  not recommended for use on any shared devices.
                </p>
                <button
                  className={`usa-button-primary${
                    optedOut ? ' usa-button-disabled' : ''
                  }`}
                  onClick={handleOptOut}
                >
                  {optedOut ? 'Opted Out' : 'Opt out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOptOut;
