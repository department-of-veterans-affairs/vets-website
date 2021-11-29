import React from 'react';
import PropTypes from 'prop-types';
import IntroductionDisplay from './IntroductionDisplay';

// @TODO Remove appointments once mock API merged in. Add cypress test for intro.
const Introduction = props => {
  const { router } = props;
  return <IntroductionDisplay router={router} />;
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
