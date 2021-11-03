// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import './styles.scss';
import MenuItemLevel1 from '../MenuItemLevel1';
import SearchDropdownComponent from 'applications/search/components/SearchDropdown/SearchDropdownComponent';
import {
  fetchSearchSuggestions,
  onSearch,
  onSuggestionSubmit,
} from '../../helpers';

export const Menu = ({ isMenuOpen, megaMenuData, showMegaMenu }) => {
  // Do not render if the menu is closed.
  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-position--absolute vads-u-width--full">
      {/* Search */}
      <p className="vads-u-padding-x--2 vads-u-color--gray-dark vads-u-margin-bottom--1">
        Search
      </p>
      <SearchDropdownComponent
        buttonText=""
        canSubmit
        className="header-search search-header-dropdown vads-u-margin-bottom--2 "
        fetchSuggestions={fetchSearchSuggestions}
        formatSuggestions
        fullWidthSuggestions
        onInputSubmit={onSearch}
        onSuggestionSubmit={onSuggestionSubmit}
        startingValue={''}
        submitOnClick
        submitOnEnter
      />

      {/* Menu items */}
      {showMegaMenu && (
        <ul
          className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0"
          role="menubar"
        >
          {megaMenuData?.map(item => (
            <MenuItemLevel1
              key={`header-menu-item-level-1-${item?.title}`}
              item={item}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

Menu.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.arrayOf(PropTypes.object),
  showMegaMenu: PropTypes.bool.isRequired,
};

export default Menu;
