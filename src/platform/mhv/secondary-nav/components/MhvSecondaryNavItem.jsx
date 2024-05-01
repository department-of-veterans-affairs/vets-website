import React from 'react';
import PropTypes from 'prop-types';

/**
 * A secondary nav item.
 * @param iconClass the classname(s) for a font awesome icon
 * @param href the link for the navigation item
 * @param title the title for the navigation item
 * @param abbreviation the abbreviation for the navigation item shown instead of the title when the width is less than 400px
 * @param isActive true if the nav item is to be shown as active
 * @returns a secondary nav item
 */
const MhvSecondaryNavItem = ({
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
        {!!iconClass && (
          <va-icon
            size={4}
            icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
            aria-hidden="true"
          />
        )}
        <span className="sec-nav-item-title">{title}</span>
        <span className="sec-nav-item-short-title">{mobileTitle}</span>
      </a>
    </div>
  );
};

MhvSecondaryNavItem.propTypes = {
  href: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  abbreviation: PropTypes.string,
  isActive: PropTypes.bool,
};

export default MhvSecondaryNavItem;
