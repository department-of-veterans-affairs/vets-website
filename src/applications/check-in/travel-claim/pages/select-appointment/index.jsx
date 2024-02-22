import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Wrapper from '../../../components/layout/Wrapper';
import { useFormRouting } from '../../../hooks/useFormRouting';

const SelectAppointment = props => {
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
    <Wrapper pageTitle={t('fpo-header')} classNames="travel-page">
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
        <va-button
          uswds
          big
          onClick={buttonClick}
          text={t('yes')}
          data-testid="yes-button"
          class="vads-u-margin-top--2"
          value="yes"
        />
      </div>
    </Wrapper>
  );
};

SelectAppointment.propTypes = {
  router: PropTypes.object,
};

export default SelectAppointment;
