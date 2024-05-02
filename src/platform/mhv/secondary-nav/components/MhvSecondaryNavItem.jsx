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
  isHeader = false,
}) => {
  const key = title.toLowerCase().replaceAll(' ', '_');
  const mobileTitle = abbreviation ? (
    <abbr title={title}>{abbreviation}</abbr>
  ) : (
    title
  );

  const activeItemClasses = isActive
    ? 'mhv-u-sec-nav-active-style vads-u-font-weight--bold'
    : '';
  const itemTypeClasses = isHeader
    ? 'mhv-u-sec-nav-header-style vads-u-font-size--lg'
    : 'mhv-u-sec-nav-item-style';

  return (
    <div
      key={key}
      className={`mhv-c-sec-nav-item vads-u-text-align--left vads-u-align-content--center ${activeItemClasses} ${itemTypeClasses}`}
      data-testid="mhv-sec-nav-item"
    >
      <a href={href} className="vads-u-text-decoration--none">
        {!!iconClass && (
          <va-icon
            size={4}
            icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
            aria-hidden="true"
          />
        )}
        <span className="mhv-u-sec-nav-item-title">{title}</span>
        <span className="mhv-u-sec-nav-short-title">{mobileTitle}</span>
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
  isHeader: PropTypes.bool,
};

export default MhvSecondaryNavItem;
