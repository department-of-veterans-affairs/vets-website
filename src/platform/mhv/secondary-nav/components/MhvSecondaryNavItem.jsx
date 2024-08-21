import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

/**
 * A secondary nav item.
 * @property {string} iconClass the classname(s) for a font awesome icon
 * @property {string} href the link for the navigation item
 * @property {string} title the title for the navigation item
 * @property {string} abbreviation the abbreviation for the navigation item shown instead of the title when the width is less than 400px
 * @property {string} ariaLabel aria label for a given abbreviation
 * @property {string} actionName the name of the action to be provided for DD monitoring purposes
 * @property {string} isActive true if the nav item is to be shown as active
 * @property {string} isHeader true if the nav item is to be shown as the header
 * @returns a secondary nav item
 */
const MhvSecondaryNavItem = ({
  icon,
  href,
  title,
  abbreviation,
  ariaLabel,
  actionName,
  isActive = false,
  isHeader = false,
  recordEvent = recordEventFn,
}) => {
  const key = title.toLowerCase().replaceAll(' ', '_');
  const itemClass = classNames(
    'mhv-c-sec-nav-item',
    'vads-u-text-align--left',
    'vads-u-display--flex',
    'vads-u-flex-wrap--wrap',
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
        aria-label={abbreviation && ariaLabel}
        onClick={() => {
          recordEvent({
            event: 'nav-mhv-secondary',
            action: 'click',
            'nav-link-text': title,
            'nav-link-url': href,
            'nav-link-location': 'MHV secondary nav',
          });
        }}
      >
        {!!icon && <va-icon icon={icon} size={3} />}
        <span className={`mhv-u-sec-nav-item-title ${titleClass}`}>
          {title}
        </span>
        <span className={`mhv-u-sec-nav-short-title ${titleClass}`}>
          {abbreviation || title}
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
  ariaLabel: PropTypes.string,
  isActive: PropTypes.bool,
  isHeader: PropTypes.bool,
  recordEvent: PropTypes.func,
};

export default MhvSecondaryNavItem;
