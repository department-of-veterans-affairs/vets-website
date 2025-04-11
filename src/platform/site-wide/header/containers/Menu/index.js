import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItemLevel1 from '../../components/MenuItemLevel1';
import Search from '../../components/Search';
import SubMenu from '../../components/SubMenu';
import { deriveMenuItemID } from '../../helpers';

export const Menu = ({ isMenuOpen, megaMenuData, showMegaMenu, subMenu }) => {
  if (!isMenuOpen) {
    return null;
  }

  if (subMenu) {
    return <SubMenu />;
  }

  const contactUsItem = {
    title: 'Contact us',
    href: '/contact-us/',
  };

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">
      <Search />
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
  showMegaMenu: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.arrayOf(PropTypes.object),
  subMenu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    menuSections: PropTypes.arrayOf(PropTypes.object),
  }),
};

const mapStateToProps = state => ({
  subMenu: state.headerMenuReducer.subMenu,
});

export default connect(mapStateToProps, null)(Menu);
