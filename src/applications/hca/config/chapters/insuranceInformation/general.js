import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

const insuranceInfo = (
  <p>
    <AdditionalInfo triggerText="Why we ask for this information">
      <p>
        We ask this information for billing purposes only. Your health insurance
        coverage doesn’t affect the VA health care benefits you can get.
      </p>
      <p>
        Giving us your health insurance information helps you for these reasons:
      </p>
      <ul>
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
    </AdditionalInfo>
  </p>
);

export default {
  uiSchema: {
    isCoveredByHealthInsurance: {
      'ui:title': (
        <>
          <p>
            Health insurance includes any coverage that you get through a spouse
            or significant other. Health insurance also includes Medicare,
            private insurance, or insurance from your employer.
          </p>
          <div className={'.vads-u-padding-x--0'}>
            Do you have health insurance coverage?
          </div>
        </>
      ),
      'ui:widget': 'yesNo',
      'ui:description': insuranceInfo,
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
    },
  },
};
