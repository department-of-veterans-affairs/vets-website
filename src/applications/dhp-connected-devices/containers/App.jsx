import React from 'react';

export default function App() {
  return (
    <div className="usa-grid usa-grid-full margin">
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <div className="schemaform-title">
            <h1>Connect your health devices</h1>
          </div>
          <div className="va-introtext">
            <p>
              Connecting a device will share your health data with VA. Connected
              devices can share data including activity, blood glucose, blood
              pressure, weight, and more. By connecting a device, this data is
              automatically shared with your care team.
            </p>
          </div>
          <p>
            <strong>Note:</strong> Your shared data will not be monitored by
            your VA care team. If you have concerns about any specific shared
            data, you must contact your care team directly.
          </p>
          <div className="schemaform-title">
            <h2>Connected devices</h2>
          </div>
          <va-alert
            close-btn-aria-label="Close notification"
            status="continue"
            visible
          >
            <h3 slot="headline">Please sign in to connect a device</h3>
            <div>
              Sign in with your existing ID.me, DS Logon, or My HealtheVet
              account. If you don't have any of these accounts, you can create a
              free ID.me account now.
            </div>
            <div>
              <button type="button" className="usa-button">
                Sign in or create an account
              </button>
            </div>
          </va-alert>
          <div className="schemaform-title">
            <h2>Frequently asked questions</h2>
          </div>
          <va-accordion
            disable-analytics={{
              value: 'false',
            }}
            section-heading={{
              value: 'null',
            }}
          >
            <va-accordion-item id="first">
              <h6 slot="headline">Question 1</h6>
            </va-accordion-item>
            <va-accordion-item header="Question 2" id="second" />
            <va-accordion-item header="Question 3" id="third" />
          </va-accordion>
        </article>
      </div>
    </div>
  );
}
