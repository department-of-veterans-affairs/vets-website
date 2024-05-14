import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  icon,
  href,
  title,
  abbreviation,
  actionName,
  isActive = false,
  isHeader = false,
}) => {
  const key = title.toLowerCase().replaceAll(' ', '_');
  const mobileTitle = abbreviation ? (
    <abbr title={title}>{abbreviation}</abbr>
  ) : (
    title
  );

  const itemClass = classNames(
    'mhv-c-sec-nav-item',
    'vads-u-text-align--left',
    'vads-u-align-content--center',
    {
      'mhv-u-sec-nav-active-style': isActive,
      'mhv-u-sec-nav-header-style': isHeader,
      'mhv-u-sec-nav-item-style': !isHeader,
    },
  );

  const titleClass = classNames({
    'vads-u-font-weight--bold': isActive,
    'vads-u-font-size--lg': isHeader,
  });

  return (
    <div key={key} className={itemClass} data-testid="mhv-sec-nav-item">
      <a
        href={href}
        data-dd-action-name={actionName}
        className="vads-u-text-decoration--none"
      >
        {!!icon && <va-icon icon={icon} size={3} />}
        <span className={`mhv-u-sec-nav-item-title ${titleClass}`}>
          {title}
        </span>
        <span className={`mhv-u-sec-nav-short-title ${titleClass}`}>
          {mobileTitle}
        </span>
      </a>
    </div>
  );
};

MhvSecondaryNavItem.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  abbreviation: PropTypes.string,
  actionName: PropTypes.string,
  isActive: PropTypes.bool,
  isHeader: PropTypes.bool,
};

export default MhvSecondaryNavItem;
