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
  if (!item?.menuSections && !item?.href && !item?.title) {
    return null;
  }

  return (
    <li
      className="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
      role="menuitem"
    >
      {/* Raw title */}
      {!item?.menuSections &&
        !item?.href && (
          <span className="vads-u-display--flex vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full">
            {item?.title}
          </span>
        )}

      {/* Title link */}
      {!item?.menuSections &&
        item?.href && (
          <a
            className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
            href={item?.href}
          >
            {item?.title}
          </a>
        )}

      {item?.menuSections && (
        <>
          {/* Expand title */}
          <button
            aria-controls={`header-menu-item-level-1-${item?.title}-items`}
            aria-expanded={showItems ? 'true' : 'false'}
            className="header-menu-item-button vads-u-background-color--primary-darker vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white"
            onKeyDown={event => event.keyCode === 13 && toggleShowItems()}
            onMouseUp={toggleShowItems}
            type="button"
          >
            {item?.title}
            {!showItems ? (
              <i
                aria-hidden="true"
                className="fa fa-plus vads-u-margin-left--1 vads-u-font-size--lg"
              />
            ) : (
              <i
                aria-hidden="true"
                className="fa fa-minus vads-u-margin-left--1 vads-u-font-size--lg"
              />
            )}
          </button>

          {/* Level 2 menu items */}
          {showItems && (
            <ul
              aria-label={item?.title}
              className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0"
              id={`header-menu-item-level-1-${item?.title}-items`}
              role="menu"
            >
              {item?.menuSections.map(itemLevel2 => (
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
