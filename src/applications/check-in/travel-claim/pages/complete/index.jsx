import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Wrapper from '../../../components/layout/Wrapper';

const Complete = () => {
  const { t } = useTranslation();

  return (
    <Wrapper pageTitle={t('fpo-header')} classNames="travel-page">
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
        Complete!
      </div>
    </Wrapper>
  );
};

Complete.propTypes = {
  router: PropTypes.object,
};

export default Complete;
