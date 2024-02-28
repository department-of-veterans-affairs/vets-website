import React from 'react';

export const HealthInsuranceDescription = () => (
  <>
    <p className="vads-u-margin-top--2">
      Health insurance includes any coverage that you get through a spouse or
      significant other. Health insurance also includes Medicare, private
      insurance, or insurance from your employer.
    </p>
    <p className="vads-u-margin-bottom--0">
      We ask for this information for billing purposes only. Your health
      insurance coverage doesn’t affect the VA health care benefits you can get.
    </p>
  </>
);

export const HealthInsuranceAddtlInfoDescription = () => (
  <va-additional-info
    trigger="Why giving us your health insurance information may help you"
    class="vads-u-margin-top--2 vads-u-margin-bottom--4"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0 vads-u-font-weight--bold">
        Giving us your health insurance information helps you for these reasons:
      </p>

      <ul className="vads-u-margin-bottom--0">
        <li>
          We must bill your private health insurance provider for any care,
          supplies, or medicines we provide to treat your non-service-connected
          conditions. If you have a VA copay, we may be able to use the payments
          from your provider to cover some or all of your copay.
        </li>
        <li>
          Your private insurance provider may apply your VA health care charges
          toward your annual deductible. Your annual deductible is the amount of
          money you pay toward your care each year before your insurance starts
          to pay for care.
        </li>
      </ul>
    </div>
  </va-additional-info>
);
