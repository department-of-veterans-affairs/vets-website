import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelVehicle = props => {
  const { router } = props;
  const { t } = useTranslation();

  return (
    <TravelPage
      header={t('did-you-travel-in-your-own-vehicle')}
      eyebrow={t('check-in')}
      helpText={t('if-you-traveled-by-bus-train-taxi-or-other--help-text')}
      pageType="travel-vehicle"
      router={router}
    />
  );
};

TravelVehicle.propTypes = {
  router: PropTypes.object,
};

export default TravelVehicle;
