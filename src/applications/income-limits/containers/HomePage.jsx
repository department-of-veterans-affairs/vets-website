import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';

const HomePage = ({ router }) => {
  useEffect(() => {
    router.push(ROUTES.ZIPCODE);
  });

  return <div />;
};

HomePage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default HomePage;
