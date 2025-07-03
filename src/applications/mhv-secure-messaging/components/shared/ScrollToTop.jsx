import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/scroll';

const ScrollToTop = props => {
  const location = useLocation();
  useEffect(
    () => {
      if (!location.hash && !document.hasFocus()) {
        scrollToTop();
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
