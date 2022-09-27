import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormRouting } from '../../hooks/useFormRouting';
import Wrapper from '../../components/layout/Wrapper';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToNextPage } = useFormRouting(router);

  return (
    <Wrapper pageTitle="Travel Mileage">
      <button
        onClick={goToNextPage}
        className="usa-button-primary usa-button-big"
        data-testid="yes-button"
        type="button"
      >
        {t('yes')}
      </button>
      <button
        onClick={goToNextPage}
        className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
        data-testid="no-button"
        type="button"
      >
        {t('no')}
      </button>
    </Wrapper>
  );
};

export default TravelMileage;
