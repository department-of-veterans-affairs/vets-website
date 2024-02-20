import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();

  const additionalInfoItems = [
    {
      info: (
        <div>
          <Trans
            i18nKey="this-must-be-true-youre-traveling-for-care"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
          <ul className="vads-u-margin-bottom--0">
            <li>
              <Trans
                i18nKey="you-have-a-va-disability-rating-of"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </li>
            <li>
              <Trans
                i18nKey="youre-traveling-for-treatment-of-a-service-connected-condition"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </li>
            <li>
              <Trans
                i18nKey="you-receive-va-pension-benefits"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </li>
            <li>
              <Trans
                i18nKey="you-have-an-annual-income-below-the-maximum"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </li>
            <li>
              <Trans
                i18nKey="you-cant-afford-to-pay-for-your-travel"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </li>
            <li>
              <Trans
                i18nKey="youre-traveling-for-one-of-these-reasons"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
              <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                <Trans
                  i18nKey="youre-traveling-in-relation-to-a-compensation-and-pension"
                  components={[
                    <span key="bold" className="vads-u-font-weight--bold" />,
                  ]}
                />
              </p>
            </li>
          </ul>
        </div>
      ),
      trigger: t('travel-reimbursement-eligibility'),
    },
    {
      info: (
        <Trans
          i18nKey="you-can-also-file-a-claim-online--help-text"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('file-for-travel-reimbursement-later'),
    },
  ];

  return (
    <TravelPage
      header={t('would-you-like-to-file-a-travel-reimbursement-claim')}
      eyebrow={t('check-in')}
      bodyText={<p>{t('we-encourage-you-to-file-travel-reimbursement-now')}</p>}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-question"
      router={router}
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
