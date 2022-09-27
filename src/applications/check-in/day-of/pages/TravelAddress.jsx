import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../hooks/useFormRouting';
import Wrapper from '../../components/layout/Wrapper';

const TravelAddress = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToNextPage } = useFormRouting(router);

  return (
    <Wrapper pageTitle="Travel Address">
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

TravelAddress.propTypes = {
  router: PropTypes.object,
};

export default TravelAddress;
