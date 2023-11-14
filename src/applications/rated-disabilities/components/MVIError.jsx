import React from 'react';

export default function MVIError() {
  return (
    <va-alert status="warning">
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3" slot="headline">
        We’re having trouble matching your information to our veteran records
      </h2>
      <div>
        <p className="vads-u-font-size--base">
          We’re having trouble matching your information to our veteran records,
          so we can’t give you access to tools for managing your health and
          benefits.
        </p>
        <p className="vads-u-font-size--base">
          If you’d like to use these tools on VA.gov, please contact your
          nearest VA medical center. Let them know you need to verify the
          information in your records, and update it as needed. The operator, or
          a patient advocate, can connect you with the right person who can
          help.
        </p>
        <p>
          <a className="vads-u-font-size--base" href={facilityLocatorUrl}>
            Find your nearest VA medical center
          </a>
        </p>
      </div>
    </va-alert>
  );
}
