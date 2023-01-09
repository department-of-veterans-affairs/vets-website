import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ScrollToTop = props => {
  const location = useLocation();
  useEffect(
    () => {
      if (!location.hash) {
        window.scrollTo(0, 0);
      }
    },
    [location],
  );

  return <>{props.children}</>;
};

ScrollToTop.propTypes = {
  children: PropTypes.any,
};

export default ScrollToTop;
