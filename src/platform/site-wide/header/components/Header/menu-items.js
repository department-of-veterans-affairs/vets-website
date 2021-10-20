import React from 'react';

const MenuItems = props => {
  const { menuItems, childMenu } = props;

  if (!menuItems) return null;

  return (
    <ul className={`navigation-menu${childMenu ? ' menu-is-child' : ''}`}>
      {menuItems.map(item => (
        <li key={item.title}>
          <a href={item.href}>
            <span>{item.title}</span>
          </a>
          <MenuItems menuItems={item.children} childMenu />
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
