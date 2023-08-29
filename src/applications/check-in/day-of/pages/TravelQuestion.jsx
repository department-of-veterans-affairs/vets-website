import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();

  const additionalInfoText = (
    <div>
      <Trans
        i18nKey="you-are-eligible-for-travel-reimbursement-if-youre"
        components={[<span key="bold" className="vads-u-font-weight--bold" />]}
      />
      <ul>
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
            i18nKey="youre-traveling-in-relation-to-a-compensation-and-pension"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </li>
      </ul>
    </div>
  );

  const helpText = (
    <Trans
      i18nKey="you-can-also-file-a-claim-online--help-text"
      components={[<span key="bold" className="vads-u-font-weight--bold" />]}
    />
  );

  return (
    <>
      <TravelPage
        header={t('would-you-like-to-file-a-travel-reimbursement-claim-now')}
        eyebrow={t('check-in')}
        bodyText={
          <p>{t('we-encourage-you-to-file-travel-reimbursement-now')}</p>
        }
        additionalInfo={additionalInfoText}
        helpText={helpText}
        pageType="travel-question"
        router={router}
      />
    </>
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
