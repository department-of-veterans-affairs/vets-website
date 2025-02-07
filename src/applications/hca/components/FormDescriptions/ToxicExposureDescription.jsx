import React from 'react';
import EnhancedEligibilityDescription from './EnhancedEligibilityDescription';

const ToxicExposureDescription = (
  <>
    <p>
      Next we’ll ask you more questions about your military service history that
      may be relevant to you based on your date of birth.
    </p>
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
        <strong>While deployed to certain areas</strong> linked to exposures
        like Agent Orange, burn pits, radiation, or contaminated water
      </li>
      <li>
        <strong>During training or active duty service</strong> by working with
        chemicals, pesticides, lead, asbestos, certain paints, nuclear weapons,
        X-rays, or other toxins
      </li>
    </ul>
    <p>
      We’ll also determine if you’re more likely to get VA health care benefits.
      We call this “enhanced eligibility status.”
    </p>
    <EnhancedEligibilityDescription />
  </>
);

export default ToxicExposureDescription;
