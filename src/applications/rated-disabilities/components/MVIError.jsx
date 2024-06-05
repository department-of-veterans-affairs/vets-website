import React from 'react';

import { getAppUrl } from '@department-of-veterans-affairs/platform-utilities/exports';

const facilityLocatorUrl = getAppUrl('facilities');

export const headline =
  'We’re having trouble matching your information to our veteran records';

export default function MVIError() {
  return (
    <va-alert status="warning">
      <h2 slot="headline">{headline}</h2>
      <div>
        <p>
          We’re having trouble matching your information to our veteran records,
          so we can’t give you access to tools for managing your health and
          benefits.
        </p>
        <p>
          If you’d like to use these tools on VA.gov, please contact your
          nearest VA medical center. Let them know you need to verify the
          information in your records, and update it as needed. The operator, or
          a patient advocate, can connect you with the right person who can
          help.
        </p>
        <p>
          <va-link
            href={facilityLocatorUrl}
            text="Find your nearest VA medical center"
          />
        </p>
      </div>
    </va-alert>
  );
}
