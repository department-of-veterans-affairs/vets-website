// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import './styles.scss';
import Search from '../../../user-nav/components/SearchMenu';
import { toggleSearchHelpUserMenu as toggleSearchHelpUserMenuAction } from 'platform/site-wide/user-nav/actions';

export const Menu = ({
  isMenuOpen,
  isSearchOpen,
  toggleSearchHelpUserMenu,
}) => {
  // Do not render if the menu is closed.
  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-position--absolute">
      {/* Search */}
      <Search
        clickHandler={() => toggleSearchHelpUserMenu('search', !isSearchOpen)}
        isOpen={isSearchOpen}
      />

      {/* Menu items */}
    </div>
  );
};

Menu.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  // From mapStateToProps.
  isSearchOpen: PropTypes.bool,
  // From mapDispatchToProps.
  toggleSearchHelpUserMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isSearchOpen: state.navigation?.utilitiesMenuIsOpen?.search,
});

const mapDispatchToProps = dispatch => ({
  toggleSearchHelpUserMenu: () => dispatch(toggleSearchHelpUserMenuAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
