import React from 'react';
import PropTypes from 'prop-types';

import TravelCompleteDisplay from '../../../components/pages/TravelComplete/TravelCompleteDisplay';

const Complete = () => {
  return <TravelCompleteDisplay />;
};

Complete.propTypes = {
  router: PropTypes.object,
};

export default Complete;
