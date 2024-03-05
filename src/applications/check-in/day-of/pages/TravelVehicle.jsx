import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelVehicle = props => {
  const { router } = props;
  const { t } = useTranslation();

  const additionalInfoItems = [
    {
      info: (
        <Trans
          i18nKey="if-you-traveled-by-bus-train-taxi-or-other-authorized--help-text"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('if-you-didnt-travel-in-your-own-vehicle'),
    },
  ];

  return (
    <TravelPage
      header={t('did-you-travel-in-your-own-vehicle')}
      eyebrow={t('check-in')}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-vehicle"
      router={router}
    />
  );
};

TravelVehicle.propTypes = {
  router: PropTypes.object,
};

export default TravelVehicle;
