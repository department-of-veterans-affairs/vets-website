// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import MenuItemLevel1 from '../../components/MenuItemLevel1';
import SearchDropdownComponent from 'applications/search/components/SearchDropdown/SearchDropdownComponent';
import SubMenu from '../../components/SubMenu';
import {
  deriveMenuItemID,
  fetchSearchSuggestions,
  onSearch,
  onSuggestionSubmit,
} from '../../helpers';

export const Menu = ({ isMenuOpen, megaMenuData, showMegaMenu, subMenu }) => {
  // Do not render if the menu is closed.
  if (!isMenuOpen) {
    return null;
  }

  // Render the sub menu if it is in state.
  if (subMenu) {
    return <SubMenu />;
  }

  const contactUsItem = {
    title: 'Contact us',
    href: '/contact-us/',
  };

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">
      {/* Search */}
      <label className="vads-u-padding-x--1p5 vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2">
        Search
      </label>
      <SearchDropdownComponent
        buttonClassName="vads-u-padding--0"
        buttonText=""
        canSubmit
        componentClassName="header-search vads-u-padding-right--1p5 vads-u-padding-bottom--2"
        containerClassName="vads-u-padding-left--1p5"
        fetchSuggestions={fetchSearchSuggestions}
        formatSuggestions
        fullWidthSuggestions
        id="header-search-dropdown"
        onInputSubmit={onSearch}
        onSuggestionSubmit={onSuggestionSubmit}
        startingValue=""
        submitOnClick
        submitOnEnter
      />

      {/* Menu items */}
      {showMegaMenu && (
        <ul
          id="header-nav-items"
          className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0"
        >
          {megaMenuData?.map(item => {
            const menuItemID = deriveMenuItemID(item, '1');
            return <MenuItemLevel1 key={menuItemID} item={item} />;
          })}
          <MenuItemLevel1 item={contactUsItem} />
        </ul>
      )}
    </div>
  );
};

Menu.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.arrayOf(PropTypes.object),
  showMegaMenu: PropTypes.bool.isRequired,
  // From mapStateToProps.
  subMenu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    menuSections: PropTypes.arrayOf(PropTypes.object),
  }),
};

const mapStateToProps = state => ({
  subMenu: state.headerMenuReducer.subMenu,
});

export default connect(
  mapStateToProps,
  null,
)(Menu);
