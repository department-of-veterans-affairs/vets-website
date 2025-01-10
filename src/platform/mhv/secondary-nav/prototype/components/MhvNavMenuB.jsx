import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { mhvNavItems } from '../data';
import Dropdown from './Dropdown';

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
const MhvNavMenuB = ({ loading }) => {
  localStorage.setItem('hasSession', true);
  /**
   * Strip the trailing slash in a path if it exists.
   * @param {String} path the path
   * @returns the path without a trailing slash
   */
  const stripTrailingSlash = path => path?.replace(/\/$/, '');

  /**
   * Find which navigation item needs to be set to active, if any. An item should be active
   * when the URL pathname starts with the app's root URL, or the href matches the current
   * URL pathname.
   * @param secNavItems the list of navigation items
   * @returns the item to be set as active, or null if none found
   */
  const findActiveItem = (secNavItems = mhvNavItems) => {
    // Perform a reverse find to match which nav link we are on, so we match on the home page last
    return [...secNavItems] // Clone the array, so the original stays the same
      .reverse()
      .find(item => {
        const appRootUrl = stripTrailingSlash(item.appRootUrl || item.href);
        // Remove the trailing slash as they are optional.
        const linkNoTrailing = stripTrailingSlash(item.href);
        const urlNoTrailing = stripTrailingSlash(window?.location?.pathname);
        return (
          window?.location?.pathname?.startsWith(appRootUrl) ||
          linkNoTrailing === urlNoTrailing
        );
      });
  };

  const activeItem = findActiveItem();
  const navContent = mhvNavItems.map(item => {
    const {
      href,
      icon,
      title,
      abbreviation,
      ariaLabel,
      isHeader = false,
    } = item;
    const isActive = activeItem === item;
    const key = title.toLowerCase().replaceAll(' ', '_');
    const itemClasses = classNames('mhv-nav-item', {
      'mhv-nav-item--active': isActive,
    });
    const titleClass = classNames({
      'vads-u-font-weight--bold': isActive,
      'vads-u-font-size--lg': isHeader,
    });
    return (
      <li key={key}>
        <a
          className={itemClasses}
          href={href}
          aria-label={abbreviation && ariaLabel}
          aria-current={isActive ? 'page' : false}
        >
          {!!icon && <va-icon icon={icon} size={3} />}
          <span className={`mhv-u-sec-nav-item-title ${titleClass}`}>
            {title}
          </span>
          <span className={`mhv-u-sec-nav-short-title ${titleClass}`}>
            {abbreviation || title}
          </span>
        </a>
      </li>
    );
  });

  return (
    <nav
      className={classNames(
        'vads-u-background-color--primary',
        'vads-u-color--white',
        { 'vads-u-visibility--hidden': loading },
      )}
      aria-label="My HealtheVet"
    >
      <div className="vads-u-font-family--sans vads-font-weight-regular usa-grid usa-grid-full row">
        <ul id="mhv-nav-menu">
          {navContent}
          <li>
            <Dropdown />
          </li>
        </ul>
      </div>
    </nav>
  );
};

MhvNavMenuB.propTypes = {
  loading: PropTypes.bool,
};

export default MhvNavMenuB;
