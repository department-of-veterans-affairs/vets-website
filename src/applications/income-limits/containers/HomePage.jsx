import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from '../constants';

const HomePage = ({ pastMode, router }) => {
  useEffect(() => {
    if (pastMode) {
      router.push(ROUTES.YEAR);
    } else {
      router.push(ROUTES.ZIPCODE);
    }
  });

  return <div />;
};

const mapStateToProps = state => ({
  pastMode: state?.incomeLimits?.pastMode,
});

HomePage.propTypes = {
  pastMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps)(HomePage);
