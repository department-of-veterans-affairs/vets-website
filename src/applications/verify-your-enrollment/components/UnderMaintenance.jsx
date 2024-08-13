import React from 'react';
import {
  VaAlert,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelp from './NeedHelp';

const UnderMaintenance = () => {
  return (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--8 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaAlert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <h2 slot="headline" id="maintenance-alert">
          System Maintenance
        </h2>
        <p>
          We are currently updating the Montgomery GI Bill enrollment
          verification application from July 29th to August 19th. In the
          meantime, you can use the{' '}
          <VaLink
            text="WAVE appliction"
            href="https://gibill.va.gov/wave/index.do"
          />{' '}
          to verify your enrollment. We’re sorry for any inconvenience this may
          cause.{' '}
        </p>
      </VaAlert>
      <NeedHelp />
    </div>
  );
};

export default UnderMaintenance;
