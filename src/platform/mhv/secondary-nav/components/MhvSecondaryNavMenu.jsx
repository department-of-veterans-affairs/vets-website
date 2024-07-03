import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
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
  const stripTrailingSlash = path => path.replace(/\/$/, '');

  /**
   * Find which navigation item needs to be set to active, if any. An item should be active
   * when the URL pathname starts with the app's root URL, or the href matches the current
   * URL pathname.
   * @param secNavItems the list of navigation items
   * @returns the item to be set as active, or null if none found
   */
  const findActiveItem = (secNavItems = items) => {
    // Perform a reverse find to match which nav link we are on, so we match on the home page last
    return [...secNavItems] // Clone the array, so the original stays the same
      .reverse()
      .find(item => {
        const appRootUrl = stripTrailingSlash(item.appRootUrl || item.href);
        // Remove the trailing slash as they are optional.
        const linkNoTrailing = stripTrailingSlash(item.href);
        const urlNoTrailing = stripTrailingSlash(window.location.pathname);
        return (
          window.location.pathname.startsWith(appRootUrl) ||
          linkNoTrailing === urlNoTrailing
        );
      });
  };

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const secNavEnabled = useToggleValue(
    TOGGLE_NAMES.mhvSecondaryNavigationEnabled,
  );

  if (!secNavEnabled) {
    return null;
  }

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
      className="vads-u-background-color--primary vads-u-color--white"
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
};

export default MhvSecondaryNavMenu;
