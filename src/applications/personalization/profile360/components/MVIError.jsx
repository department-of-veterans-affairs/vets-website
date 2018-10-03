import React from 'react';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default function MVIError({ facilitiesClick }) {
  return (
    <div>
      <h1>Your Profile</h1>
      <h4>
        We’re having trouble matching your information to our Veteran records
      </h4>
      <p>
        We’re sorry. We’re having trouble matching your information to our
        Veteran records, so we can’t give you access to tools for managing your
        health and benefits.
      </p>

      <p>
        If you’d like to use these tools on {propertyName}, please contact your
        nearest VA medical center. Let them know you need to verify the
        information in your records, and update it as needed. The operator, or a
        patient advocate, can connect you with the right person who can help.
      </p>

      <p>
        <a href="/facilities/" onClick={facilitiesClick}>
          Find your nearest VA Medical Center
        </a>
        .
      </p>
    </div>
  );
}
