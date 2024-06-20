import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelEligibilityAddtionalInfo from '../../components/TravelEligibilityAdditionalInfo';
import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();

  const additionalInfoItems = [
    {
      info: <TravelEligibilityAddtionalInfo />,
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
