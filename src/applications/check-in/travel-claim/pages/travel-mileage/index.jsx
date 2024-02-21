import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelMileageDisplay from '../../../components/pages/TravelMileage/TravelMileageDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToNextPage } = useFormRouting(router);

  const buttonClick = useCallback(
    () => {
      goToNextPage();
    },
    [goToNextPage],
  );

  return (
    <TravelMileageDisplay header={t('fpo-header')} buttonClick={buttonClick} />
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;
