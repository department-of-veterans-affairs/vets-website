import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MhvSecondaryNavItem from './MhvSecondaryNavItem';

/**
 * MHV secondary navigation bar.
 * LIMITATIONS: The logic to set an item to active is based on a first match approach
 * looking through the list of items in reverse order. As such, '/my-health' home
 * page is expected to be the first item in the item list. The first item in the list
 * is expected to be the header item.
 *
 * @property {Object[]} items the list of items to display in the navigation bar
 * @returns the navigation bar
 */
const MhvSecondaryNavMenu = ({ items }) => {
  /**
   * Strip the trailing slash in a path if it exists.
   * @param {String} path the path
   * @returns the path without a trailing slash
   */
  const stripTrailingSlash = path => path?.replace(/\/$/, '');

  /**
   * Find which navigation item, if any, should be set as active based on the current URL.
   * This method compares the first two segments of the current URL pathname with each item's
   * `appRootUrl` or `href`. It returns the first matching item or undefined if no match is found.
   *
   * @param secNavItems the list of navigation items
   * @returns the item to be set as active, or undefined if none found
   */
  const findActiveItem = (secNavItems = items) => {
    return [...secNavItems] // Clone the array, so the original stays the same
      .find(item => {
        // Normalizes paths by removing trailing slashes to ensure consistent comparisons
        const appRootUrl = stripTrailingSlash(item.appRootUrl || item.href);
        const currentPath =
          stripTrailingSlash(window?.location?.pathname) || '';
        // Extracts the first two segment of the current URL for root path comparison
        const currentAppRootPath = currentPath
          .split('/')
          .slice(0, 3)
          .join('/');
        return appRootUrl === currentAppRootPath;
      });
  };

  const activeItem = findActiveItem();
  const navContent = items.map((item, index) => {
    const key = item.title.toLowerCase().replaceAll(' ', '_');
    return (
      <MhvSecondaryNavItem
        {...item}
        isActive={activeItem === item}
        key={key}
        isHeader={index === 0}
      />
    );
  });

  return (
    <nav
      className={classNames(
        'vads-u-background-color--primary',
        'vads-u-color--white',
      )}
      aria-label="My HealtheVet"
    >
      <div className="vads-u-font-family--sans vads-font-weight-regular usa-grid usa-grid-full row">
        <div className="mhv-c-sec-nav-bar-row vads-u-display--flex vads-u-flex-wrap--wrap vads-u-text-align--left vads-u-width--full">
          {navContent}
        </div>
      </div>
    </nav>
  );
};

MhvSecondaryNavMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      abbreviation: PropTypes.string,
      actionName: PropTypes.string,
      ariaLabel: PropTypes.string,
      appRootUrl: PropTypes.string,
    }),
  ),
  loading: PropTypes.bool,
};

export default MhvSecondaryNavMenu;
