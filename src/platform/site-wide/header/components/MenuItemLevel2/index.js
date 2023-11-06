import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import { deriveMenuItemID, formatMenuItems } from '../../helpers';
import { updateSubMenuAction } from '../../containers/Menu/actions';

export const MenuItemLevel2 = ({ item, lastClickedMenuID, updateSubMenu }) => {
  const menuItemID = deriveMenuItemID(item, '2');
  const shouldFocus = menuItemID === lastClickedMenuID;

  useEffect(
    () => {
      if (shouldFocus) {
        document.getElementById(menuItemID)?.focus?.();
      }
    },
    [shouldFocus, menuItemID],
  );

  if (!item?.links && !item?.href && !item?.title) {
    return null;
  }

  const toggleShowItems = title => () => {
    recordEvent({
      event: 'nav-header-second-level',
      'nav-header-action': `Navigation - Header - Open Second Level - ${title}`,
    });

    updateSubMenu({
      id: menuItemID,
      menuSections: formatMenuItems(item?.links),
    });
  };

  return (
    <li
      className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
      data-e2e-id={item?.title?.replaceAll(' ', '-')}
    >
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
            data-e2e-id={item?.title
              ?.replaceAll(' ', '-')
              ?.replaceAll(/[{(,&)}]/g, '')
              .toLowerCase()}
            href={item?.href}
          >
            {item?.title}
          </a>
        )}
      {/* Expand title */}
      {item?.links && (
        <button
          className="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
          data-e2e-id={menuItemID}
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
  lastClickedMenuID: PropTypes.string,
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
