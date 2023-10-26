import React from 'react';

const NoHealthAlert = () => {
  return (
    <va-alert status="warning" visible data-testid="no-health-message">
      <h2 slot="headline">You do not have access to My HealtheVet tools</h2>
      <div>
        <p className="vads-u-margin-y--0">
          To access tools and your health data on My HealtheVet, <b>one</b> of
          the following must be true:
          <ul>
            <li>
              You have received care at a VA facility, <b>or</b>
            </li>
            <li>You have applied for VA health care</li>
          </ul>
        </p>
        <p className="vads-u-margin-y--0">
          If you believe you have received care at a VA facility, please call
          that facility to find out if you are registered as a patient there.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/find-locations">Lookup a facility’s phone number</a>
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/health-care/apply/application/introduction">
            Apply for health care
          </a>
        </p>
      </div>
    </va-alert>
  );
};

export default NoHealthAlert;
