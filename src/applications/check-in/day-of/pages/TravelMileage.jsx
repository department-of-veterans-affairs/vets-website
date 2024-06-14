import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const additionalInfoItems = [
    {
      info: (
        <Trans
          i18nKey="if-you-need-to-submit-receipts-for-other-expenses--helptext"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('if-you-have-other-expenses-to-claim'),
    },
  ];

  return (
    <TravelPage
      header={t('are-you-claiming-only-mileage')}
      eyebrow={t('check-in')}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-mileage"
      router={router}
    />
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;
