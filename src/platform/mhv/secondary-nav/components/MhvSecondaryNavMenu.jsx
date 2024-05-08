import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import MhvSecondaryNavItem from './MhvSecondaryNavItem';

/**
 * MHV secondary navigation bar.
 * LIMITATIONS: The logic to set an item to active is based on a first match approach
 * looking through the list of items in reverse order. As such, '/my-health' home
 * page is expected to be the first item in the list.
 *
 * @param {SecondaryNavItem[]} items the list of items to display in the navigation bar
 * @returns the navigation bar
 */
const MhvSecondaryNavMenu = ({ items }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const secNavEnabled = useToggleValue(
    TOGGLE_NAMES.mhvSecondaryNavigationEnabled,
  );

  if (!secNavEnabled) {
    return null;
  }

  // Perform a reverse find to match which nav link we are on, so we match on the home page last
  const activeItem = [...items] // Clone the array, so the original stays the same
    .reverse()
    .find(item => window.location.pathname.startsWith(item.href));

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
      <div className="mhv-c-sec-nav-bar vads-u-display--flex vads-u-font-family--sans vads-font-weight-regular usa-grid usa-grid-full row">
        <div className="mhv-c-sec-nav-bar-row vads-u-display--flex vads-u-flex-wrap--wrap vads-u-text-align--left vads-u-width--full">
          {navContent}
        </div>
      </div>
    </nav>
  );
};

MhvSecondaryNavMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(MhvSecondaryNavItem.propTypes)),
};

export default MhvSecondaryNavMenu;
