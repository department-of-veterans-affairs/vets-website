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
      <p className="vads-u-padding-x--2 vads-u-color--gray-dark vads-u-margin-bottom--1">
        Search
      </p>
      <SearchDropdownComponent
        buttonText=""
        canSubmit
        id="header-search-dropdown"
        componentClassName="vads-u-margin-bottom--2"
        containerClassName="vads-u-max-width--none vads-u-margin-left--2 vads-u-padding--0"
        buttonClassName="vads-u-padding--0 vads-u-margin-right--2"
        inputClassName="vads-u-max-width--none vads-u-margin--0 "
        suggestionsListClassName=""
        suggestionClassName=""
        fetchSuggestions={fetchSearchSuggestions}
        formatSuggestions
        fullWidthSuggestions
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
