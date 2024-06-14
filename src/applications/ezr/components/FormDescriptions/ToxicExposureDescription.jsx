import React from 'react';
import EnhancedEligibilityDescription from './EnhancedEligibilityDescription';

const ToxicExposureDescription = (
  <>
    <p>Next we’ll ask you questions about your military service history.</p>
    <p>
      It’s your choice whether you want to answer these questions. Before you
      decide, here’s what you should know about how we’ll use this information.
    </p>
    <p>
      This will help us determine if you may have had exposure to any toxins or
      other hazards in either of these ways:
    </p>
    <ul>
      <li>
        While deployed to certain areas linked to exposures like Agent Orange,
        burn pits, radiation, or contaminated water
      </li>
      <li>
        By working with chemicals, pesticides, lead, asbestos, certain paints,
        nuclear weapons, x-rays, or other toxins during active duty training or
        service
      </li>
    </ul>
    <p>
      We’ll also determine if you qualify for enhanced eligibility status. This
      means that we may place you in a higher priority group. This may affect
      how much (if anything) you’ll have to pay toward the cost of your care.
    </p>
    <EnhancedEligibilityDescription />
  </>
);

export default ToxicExposureDescription;
