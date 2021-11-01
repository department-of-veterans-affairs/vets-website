// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import MenuItemLevel2 from '../MenuItemLevel2';

export const MenuItemLevel1 = ({ item }) => {
  const [showItems, setShowItems] = useState(false);

  const toggleShowItems = () => {
    setShowItems(!showItems);
  };

  // Do not render if we are missing necessary menu item data.
  if (!item.menuSections && !item.href && !item.title) {
    return null;
  }

  return (
    <li className="vads-u-margin--0 vads-u-padding--0" role="menuitem">
      {/* Raw title */}
      {!item.menuSections && !item.href && item.title}

      {/* Title link */}
      {!item.menuSections && item.href && <a href={item.href}>{item.title}</a>}

      {item.menuSections && (
        <>
          {/* Expand title */}
          <button
            aria-controls={`header-menu-item-level-1-${item.title}-items`}
            aria-expanded={showItems ? 'true' : 'false'}
            onKeyDown={event => event.keyCode === 13 && toggleShowItems()}
            onMouseUp={toggleShowItems}
            type="button"
          >
            {item.title}
            {!showItems ? (
              <i
                aria-hidden="true"
                className="fa fa-plus vads-u-margin-left--1 vads-u-font-size--sm"
              />
            ) : (
              <i
                aria-hidden="true"
                className="fa fa-minus vads-u-margin-left--1 vads-u-font-size--sm"
              />
            )}
          </button>

          {/* Level 2 menu items */}
          {showItems && (
            <ul
              aria-label={item.title}
              className="vads-u-display--flex vads-u-flex-direction--column"
              id={`header-menu-item-level-1-${item.title}-items`}
              role="menu"
            >
              {item.menuSections.map(itemLevel2 => (
                <MenuItemLevel2
                  key={`header-menu-item-level-2-${itemLevel2.title}`}
                  item={itemLevel2}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

MenuItemLevel1.propTypes = {
  item: PropTypes.shape({
    href: PropTypes.string,
    menuSections: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    title: PropTypes.string.isRequired,
  }),
};

export default MenuItemLevel1;
