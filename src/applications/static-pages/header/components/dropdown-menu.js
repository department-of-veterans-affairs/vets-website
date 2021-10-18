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
