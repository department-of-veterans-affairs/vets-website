import React from 'react';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Blue expandable info alert for users at OH facilities that have transitioned
 * to the integrated MHV experience. Displays messaging that they can now manage
 * their medical records on VA.gov instead of My VA Health portal.
 */
const OhTransitionAlert = () => {
  return (
    <va-alert-expandable
      class="vads-u-margin-bottom--3 vads-u-margin-top--2"
      data-testid="oh-transition-alert"
      status="info"
      trigger="You can now manage most of your medical records for all VA facilities right here"
    >
      <div data-testid="oh-transition-alert-content">
        <p>
          We’ve brought all your VA health care data together so you can manage
          your care in one place. You can review and download most of your
          medical records here.
        </p>
        <p>Still want to use My VA Health for now?</p>
        <VaLinkAction
          data-testid="oh-transition-alert-link"
          href={getCernerURL('/pages/health_record/clinical-documents', true)}
          type="secondary"
          text="Go to My VA Health"
        />
      </div>
    </va-alert-expandable>
  );
};

export default OhTransitionAlert;
