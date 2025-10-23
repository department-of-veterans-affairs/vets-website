import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { useUpdateError } from '../../../hooks/useUpdateError';

import TravelPage from '../../../components/pages/TravelPage';

const TravelVehicle = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const additionalInfoItems = [
    {
      info: (
        <Trans
          i18nKey="if-you-traveled-by-bus-train-taxi-or-other-authorized--help-text--v2"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('if-you-didnt-travel-in-your-own-vehicle'),
    },
  ];
  const noFunction = () => {
    updateError('cant-file-claim-type');
  };
  return (
    <TravelPage
      header={t('did-you-travel-in-your-own-vehicle')}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-vehicle"
      router={router}
      noFunction={noFunction}
      testID="travel-claim-vehicle-page"
    />
  );
};

TravelVehicle.propTypes = {
  router: PropTypes.object,
};

export default TravelVehicle;
