/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react';
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
   * Check if the text is set to large in the browser settings,
   * and apply a class to prevent the nav items from wrapping.
   */
  const [isLargeText, setIsLargeText] = useState(false);

  const checkFontSize = useCallback(() => {
    try {
      // Check root font size
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );

      // Check actual rendered text size
      const testDiv = document.createElement('div');
      testDiv.style.fontSize = '1rem';
      testDiv.style.padding = '0';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      testDiv.style.lineHeight = 'normal';
      testDiv.textContent = 'M';

      document.body.appendChild(testDiv);
      const actualSize = testDiv.clientHeight;
      document.body.removeChild(testDiv);

      // Determine if text is large
      const newIsLargeText = rootFontSize > 16 || actualSize > 20;

      setIsLargeText(newIsLargeText);
    } catch (error) {
      console.log('Error checking font size:', error.message);
    }
  }, []);

  useEffect(
    () => {
      const checkAndUpdateFontSize = () => {
        try {
          setTimeout(checkFontSize, 0);
        } catch (error) {
          console.log('Error in checkAndUpdateFontSize:', error.message);
        }
      };

      checkAndUpdateFontSize();

      let resizeObserver;
      try {
        resizeObserver = new ResizeObserver(checkAndUpdateFontSize);
        resizeObserver.observe(document.documentElement);
      } catch (error) {
        console.log('Error setting up ResizeObserver:', error.message);
      }

      window.addEventListener('resize', checkAndUpdateFontSize);

      return () => {
        try {
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
          window.removeEventListener('resize', checkAndUpdateFontSize);
        } catch (error) {
          console.log('Error in cleanup function:', error.message);
        }
      };
    },
    [checkFontSize],
  );
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
  const findActiveItem = (secNavItems = items) => {
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
        <div
          className={`mhv-c-sec-nav-bar-row vads-u-display--flex vads-u-flex-wrap--wrap vads-u-text-align--left vads-u-width--full ${
            isLargeText ? 'mhv-c-large-text-wrapper' : ''
          }`}
        >
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
