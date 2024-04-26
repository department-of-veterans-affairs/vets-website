import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

/**
 * MHV secondary navigation items. Note the first item is the home link.
 */
export const mhvSecNavItems = [
  {
    title: 'My HealtheVet',
    iconClass: 'fas fa-home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    abbreviation: 'Appts',
    iconClass: 'fas fa-calendar',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    iconClass: 'fas fa-comments',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    iconClass: 'fas fa-prescription-bottle',
    href: `/my-health/medications`,
  },
  {
    title: 'Records',
    iconClass: 'fas fa-file-medical',
    href: `/my-health/medical-records`,
  },
];

/**
 * A secondary nav item.
 * @param iconClass the classname(s) for a font awesome icon
 * @param href the link for the navigation item
 * @param title the title for the navigation item
 * @param abbreviation the abbreviation for the navigation item shown instead of the title when the width is less than 400px
 * @param isActive true if the nav item is to be shown as active
 * @returns a secondary nav item
 */
const SecondaryNavItem = ({
  iconClass,
  href,
  title,
  abbreviation,
  isActive = false,
}) => {
  const key = title.toLowerCase().replaceAll(' ', '_');
  const mobileTitle = abbreviation ? (
    <abbr title={title}>{abbreviation}</abbr>
  ) : (
    title
  );
  return (
    <div
      key={key}
      className={`mhv-sec-nav-item ${isActive ? 'sec-nav-item-active' : ''}`}
      data-testid="mhv-sec-nav-item"
    >
      <a href={href}>
        {!!iconClass && <i className={iconClass} aria-hidden="true" />}
        <span className="sec-nav-item-title">{title}</span>
        <span className="sec-nav-item-short-title">{mobileTitle}</span>
      </a>
    </div>
  );
};

SecondaryNavItem.propTypes = {
  href: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  abbreviation: PropTypes.string,
  isActive: PropTypes.bool,
};

/**
 * MHV secondary navigation bar.
 * LIMITATIONS: The logic to set an item to active is based on a first match approach
 * looking through the list of items in reverse order. As such, '/my-health' home
 * page is expected to be the first item in the list.
 *
 * @param {SecondaryNavItem} items the list of items to display in the navigation bar
 * @returns the navigation bar
 */
const MhvSecondaryNav = ({ items = mhvSecNavItems }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const secNavEnabled = useToggleValue(TOGGLE_NAMES.mhvSecondaryNav);

  if (secNavEnabled) {
    // Perform a reverse find to match which nav link we are on, so we match on the home page last
    const activeItem = [...items] // Clone the array, so the original stays the same
      .reverse()
      .find(item => window.location.pathname.startsWith(item.href));

    const navContent = items.map(item => {
      const key = item.title.toLowerCase().replaceAll(' ', '_');
      return (
        <SecondaryNavItem
          title={item.title}
          href={item.href}
          iconClass={item.iconClass}
          abbreviation={item.abbreviation}
          isActive={activeItem === item}
          key={key}
        />
      );
    });

    return (
      <nav id="mhv-sec-nav-bar">
        <div className="mhv-sec-nav-container vads-u-font-family--sans vads-font-weight-regular">
          <div className="mhv-sec-nav-item-row">{navContent}</div>
        </div>
      </nav>
    );
  }
  return null;
};

MhvSecondaryNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(SecondaryNavItem.propTypes)),
};

export default MhvSecondaryNav;
