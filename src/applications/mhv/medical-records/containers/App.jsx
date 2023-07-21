import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import MrBreadcrumbs from '../components/MrBreadcrumbs';
import ScrollToTop from '../components/shared/ScrollToTop';
import Navigation from '../components/Navigation';

const App = ({ children }) => {
  const [isHidden, setIsHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const location = useLocation();
  const measuredRef = useRef();

  useEffect(
    () => {
      if (height) {
        // small screen (mobile)
        if (window.innerWidth <= 481 && height > window.innerHeight * 4) {
          setIsHidden(false);
        }
        // medium screen (desktop/tablet)
        else if (window.innerWidth > 481 && height > window.innerHeight * 2) {
          setIsHidden(false);
        }
        // default to hidden
        else {
          setIsHidden(true);
        }
      }
    },
    [height, location],
  );

  useEffect(() => {
    if (!measuredRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setHeight(measuredRef.current.offsetHeight);
    });
    resizeObserver.observe(measuredRef.current);
  }, []);

  return (
    <div ref={measuredRef} className="vads-l-grid-container">
      <MrBreadcrumbs />
      <div className="medical-records-container">
        <Navigation />
        <div className="vads-l-grid-container main-content">
          <ScrollToTop />
          {children}
          <va-back-to-top hidden={isHidden} />
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
