import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  return (
    <TravelPage
      header={t('are-you-claiming-only-mileage-and-no-other')}
      eyebrow={t('check-in')}
      helpText={t(
        'if-you-need-to-submit-receipts-for-other-expenses--helptext',
      )}
      pageType="travel-mileage"
      router={router}
    />
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;
