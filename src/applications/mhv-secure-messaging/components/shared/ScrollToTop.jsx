import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ScrollToTop = props => {
  const location = useLocation();
  useEffect(
    () => {
      if (!location.hash && !document.hasFocus()) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
