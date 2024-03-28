import React from 'react';

const EnhancedEligibilityDescription = () => (
  <va-additional-info
    trigger="Learn more about enhanced eligibility status for VA health care"
    class="vads-u-margin-bottom--3"
    uswds
  >
    <p className="vads-u-font-weight--bold">
      You may qualify for enhanced eligibility status if you receive any of
      these benefits:
    </p>
    <ul>
      <li>VA pension</li>
      <li>VA service-connected disability compensation</li>
      <li>Medicaid benefits</li>
    </ul>
    <p className="vads-u-font-weight--bold">
      You may also qualify for enhanced eligibility status if you fit one of
      these descriptions:
    </p>
    <ul>
      <li>You’re a former Prisoner of War (POW).</li>
      <li>You received a Purple Heart.</li>
      <li>You received a Medal of Honor.</li>
      <li>
        You served in Southwest Asia during the Gulf War between August 2, 1990,
        and November 11, 1998.
      </li>
      <li>
        You were exposed to toxins or hazards by working with chemicals,
        pesticides, lead, asbestos, certain paints, nuclear weapons, x-rays, or
        other toxins. This exposure could have happened while training or
        serving on active duty, even if you were never deployed.
      </li>
      <li>
        You served at least 30 days at Camp Lejeune between August 1, 1953, and
        December 31, 1987.
      </li>
      <li>
        You served in a location where you had exposure to Agent Orange during
        the Vietnam War era.
      </li>
    </ul>
  </va-additional-info>
);

export default EnhancedEligibilityDescription;
