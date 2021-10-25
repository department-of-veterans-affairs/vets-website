// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import LegacyHeader from '../LegacyHeader';

// This is the Header v2 component, it will be built out in a follow-up PR.
export const Header = props => {
  return <LegacyHeader {...props} />;
};

Header.propTypes = {
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
