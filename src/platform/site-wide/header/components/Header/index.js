// Node modules.
import React from 'react';
import PropTypes from 'prop-types';

// This is the Header v2 component, it will be built out in a follow-up PR.
export const Header = () => {
  return <header className="header">New header</header>;
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
