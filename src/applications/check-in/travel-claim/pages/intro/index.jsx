import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import TravelIntroDisplay from '../../../components/pages/TravelIntro/TravelIntroDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

const TravelIntro = props => {
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
    <TravelIntroDisplay header={t('fpo-header')} buttonClick={buttonClick} />
  );
};

TravelIntro.propTypes = {
  router: PropTypes.object,
};

export default TravelIntro;
