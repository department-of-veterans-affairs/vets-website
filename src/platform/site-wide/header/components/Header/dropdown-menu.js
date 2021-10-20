import React from 'react';
import MenuItems from './menu-items';

const DropdownMenu = props => {
  const { menuItems } = props;

  return (
    <div>
      <MenuItems menuItems={menuItems} />
    </div>
  );
};

export default DropdownMenu;

// {/* Mega menu */}
// {showMegaMenu && (
//   <div className="usa-grid usa-grid-full">
//     <div className="menu-rule usa-one-whole" />
//     <div className="mega-menu" id="mega-menu" />
//   </div>
// )}
