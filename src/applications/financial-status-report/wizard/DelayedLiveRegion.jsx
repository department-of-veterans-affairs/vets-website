import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/* aria-live region must be on the screen FIRST when rendering conditional content
   artificial delay on the content so it will always render second and the region will announce the updated conditional content
   not wrapping the wizard as a whole to avoid a overly verbose experience on screen readers */
const DelayedLiveRegion = ({ children, delay = 100 }) => {
  const [timer, setTimer] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const shouldRenderContent = showContent;

  useEffect(() => {
    let interval = null;

    if (interval === null) {
      interval = setInterval(() => {
        setTimer(milliseconds => milliseconds + 1);
      }, 1);
    }

    if (delay + 1 === timer) {
      setShowContent(true);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      setShowContent(false);
    };
  }, [timer, delay]);

  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="wizard-results"
    >
      {shouldRenderContent && children}
    </section>
  );
};

DelayedLiveRegion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  delay: PropTypes.number,
};

export default DelayedLiveRegion;
