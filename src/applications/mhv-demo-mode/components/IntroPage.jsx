import React from 'react';
import sessionStorage from 'platform/utilities/storage/sessionStorage';
import { DEMO_MODE_ACKNOWLEDGED } from '../constants';

export default function IntroPage() {
  const handleContinue = e => {
    e.preventDefault();
    sessionStorage.setItem(DEMO_MODE_ACKNOWLEDGED, Date.now().toString());
    window.location.href = '/demo-mode/my-health';
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <div className="vads-l-row vads-u-justify-content--center">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <h1>My HealtheVet Demo</h1>
          <va-alert status="info" visible uswds>
            <h2 slot="headline">This is a demo environment</h2>
            <p>
              You are entering a demonstration version of My HealtheVet on
              VA.gov. This environment uses mock data and does not connect to
              real veteran health records or services.
            </p>
          </va-alert>
          <p className="vads-u-font-size--lg vads-u-margin-top--3">
            Use this demo to explore the My HealtheVet experience, including the
            landing page, messaging, medications, medical records, and more.
          </p>
          <a
            className="vads-c-action-link--green vads-u-margin-top--3"
            href="/demo-mode/my-health"
            onClick={handleContinue}
          >
            Continue to My HealtheVet Demo
          </a>
        </div>
      </div>
    </div>
  );
}
