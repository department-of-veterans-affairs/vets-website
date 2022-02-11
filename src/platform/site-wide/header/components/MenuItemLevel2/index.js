// Node modules.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { deriveMenuItemID, formatMenuItems } from '../../helpers';
import { updateSubMenuAction } from '../../containers/Menu/actions';

export const MenuItemLevel2 = ({ item, lastClickedMenuID, updateSubMenu }) => {
  // Derive the menu item's ID.
  const menuItemID = deriveMenuItemID(item, '2');

  // Derive if we the menu item is expanded.
  const shouldFocus = menuItemID === lastClickedMenuID;

  // Focus item if last clicked when coming back from SubMenu.
  useEffect(
    () => {
      if (shouldFocus) {
        document.getElementById(menuItemID)?.focus?.();
      }
    },
    [shouldFocus, menuItemID],
  );

  // Do not render if we are missing necessary menu item data.
  if (!item?.links && !item?.href && !item?.title) {
    return null;
  }

  const toggleShowItems = title => () => {
    // Record event.
    recordEvent({
      event: 'nav-header-second-level',
      'nav-header-action': `Navigation - Header - Open Second Level - ${title}`,
    });

    // Update the sub menu.
    updateSubMenu({
      id: menuItemID,
      menuSections: formatMenuItems(item?.links),
    });
  };

  return (
    <li className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
      {/* Raw title */}
      {!item?.links &&
        !item?.href && (
          <span className="vads-u-display--flex vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-width--full">
            {item?.title}
          </span>
        )}

      {/* Title link */}
      {!item?.links &&
        item?.href && (
          <a
            className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-width--full"
            href={item?.href}
          >
            {item?.title}
          </a>
        )}

      {/* Expand title */}
      {item?.links && (
        <button
          className="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
          id={menuItemID}
          onClick={toggleShowItems(item?.title)}
          type="button"
        >
          {item?.title}
          <i
            aria-hidden="true"
            className="fa fa-chevron-right vads-u-margin-left--1 vads-u-font-size--lg"
          />
        </button>
      )}
    </li>
  );
};

MenuItemLevel2.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.shape({
      href: PropTypes.string,
      links: PropTypes.shape({
        columnOne: PropTypes.shape({
          title: PropTypes.string,
          links: PropTypes.arrayOf(
            PropTypes.shape({
              title: PropTypes.string,
              href: PropTypes.string,
            }),
          ),
        }),
        columnTwo: PropTypes.shape({
          title: PropTypes.string,
          links: PropTypes.arrayOf(
            PropTypes.shape({
              title: PropTypes.string,
              href: PropTypes.string,
            }),
          ),
        }),
        columnThree: PropTypes.shape({
          description: PropTypes.string,
          img: PropTypes.shape({
            src: PropTypes.string,
            alt: PropTypes.string,
          }),
          link: PropTypes.shape({
            text: PropTypes.string,
            href: PropTypes.string,
          }),
        }),
        seeAllLink: PropTypes.shape({
          text: PropTypes.string,
          href: PropTypes.string,
        }),
      }),
      title: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      columnOne: PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            href: PropTypes.string,
          }),
        ),
      }),
      columnTwo: PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            href: PropTypes.string,
          }),
        ),
      }),
      columnThree: PropTypes.shape({
        description: PropTypes.string,
        img: PropTypes.shape({
          src: PropTypes.string,
          alt: PropTypes.string,
        }),
        link: PropTypes.shape({
          text: PropTypes.string,
          href: PropTypes.string,
        }),
      }),
      mainColumn: PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string,
            href: PropTypes.string,
          }),
        ),
      }),
    }),
  ]),
  // From mapStateToProps.
  lastClickedMenuID: PropTypes.string,
  // From mapDispatchToProps.
  updateSubMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastClickedMenuID: state.headerMenuReducer.lastClickedMenuID,
});

const mapDispatchToProps = dispatch => ({
  updateSubMenu: subMenu => dispatch(updateSubMenuAction(subMenu)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuItemLevel2);
