import React from 'react';
import { Trans } from 'react-i18next';

const TravelEligibilityAddtionalInfo = () => {
  const boldComponent = [
    <span key="bold" className="vads-u-font-weight--bold" />,
  ];
  return (
    <div data-testid="travel-reimbursement-content">
      <Trans
        i18nKey="this-must-be-true-youre-traveling-for-care"
        components={boldComponent}
      />
      <ul className="vads-u-margin-bottom--0">
        <li className="vads-u-margin-bottom--2">
          <Trans
            i18nKey="you-have-a-va-disability-rating-of"
            components={boldComponent}
          />
        </li>
        <li className="vads-u-margin-bottom--2">
          <Trans
            i18nKey="youre-traveling-for-treatment-of-a-service-connected-condition"
            components={boldComponent}
          />
        </li>
        <li className="vads-u-margin-bottom--2">
          <Trans
            i18nKey="you-receive-va-pension-benefits"
            components={boldComponent}
          />
        </li>
        <li className="vads-u-margin-bottom--2">
          <Trans
            i18nKey="you-have-an-annual-income-below-the-maximum"
            components={boldComponent}
          />
        </li>
        <li className="vads-u-margin-bottom--2">
          <Trans
            i18nKey="you-cant-afford-to-pay-for-your-travel"
            components={boldComponent}
          />
        </li>
        <li>
          <Trans
            i18nKey="youre-traveling-for-one-of-these-reasons"
            components={boldComponent}
          />
          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
            <Trans
              i18nKey="youre-traveling-in-relation-to-a-compensation-and-pension"
              components={boldComponent}
            />
          </p>
        </li>
      </ul>
    </div>
  );
};

export default TravelEligibilityAddtionalInfo;
