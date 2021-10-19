// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import Header from '../Header';
import LegacyHeader from '../LegacyHeader';

const MOBILE_BREAKPOINT_PX = 768;

export const App = ({
  megaMenuData,
  show,
  showHeaderV2,
  showMegaMenu,
  showNavLogin,
}) => {
  // Derive if we are on desktop.
  const [isDesktop, setIsDesktop] = useState(false);

  // Derive if we are on desktop and set isDesktop state.
  const deriveIsDesktop = () =>
    setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

  useEffect(() => {
    // Set screen size listener.
    window.addEventListener('resize', deriveIsDesktop);

    // Clear listener.
    return () => window.removeEventListener('resize', deriveIsDesktop);
  }, []);

  // Do not render if prop show is falsey.
  if (!show) {
    return null;
  }

  // Render the legacy header if the feature toggle is NOT enabled OR if we are on desktop.
  if (!showHeaderV2 || isDesktop) {
    return (
      <LegacyHeader
        megaMenuData={megaMenuData}
        showMegaMenu={showMegaMenu}
        showNavLogin={showNavLogin}
      />
    );
  }

  return <Header />;
};

App.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  show: PropTypes.bool.isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
  // From mapStateToProps.
  showHeaderV2: PropTypes.bool,
};

const mapStateToProps = state => ({
  showHeaderV2: state?.featureToggles?.showHeaderV2,
});

export default connect(
  mapStateToProps,
  null,
)(App);
