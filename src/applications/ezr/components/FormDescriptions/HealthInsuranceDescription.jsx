import React from 'react';

const HealthInsuranceDescription = () => (
  <va-additional-info
    trigger="Why we ask for health insurance information?"
    class="vads-u-margin-y--2"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We ask for this information for billing purposes only. Your health
        insurance coverage doesn’t affect the VA health care benefits you can
        get.
      </p>

      <p>
        Giving us your health insurance information helps you for these reasons:
      </p>

      <ul className="vads-u-margin-bottom--0">
        <li>
          We must bill your private health insurance provider for any care,
          supplies, or medicines we provide to treat your non-service-connected
          conditions. If you have a VA copayment, we may be able to use the
          payments from your provider to cover some or all of your copayment.
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

export default HealthInsuranceDescription;
