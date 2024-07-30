import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

export const externalLinkText = '(opens in new tab)';

const NavCard = ({
  icon = null,
  iconClasses = 'vads-u-margin-right--1p5',
  title,
  links,
}) => {
  const listItems = links.map(({ ariaLabel, href, text, isExternal }) => (
    <li className="mhv-c-navlistitem" key={href}>
      <a
        className={isExternal ? 'mhv-c-navlink-external' : 'mhv-c-navlink'}
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? '_blank' : ''}
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': text,
            'links-list-section-header': title,
          });
        }}
        rel="noreferrer"
      >
        <span className="mhv-c-link-content">
          <span
            className={`mhv-c-link-text ${
              ariaLabel?.includes('unread') ? 'mhv-c-indicator' : ''
            }`}
          >
            {text} {isExternal && externalLinkText}
          </span>
          {!isExternal && (
            <va-icon
              class="link-icon vads-u-margin-right--neg1 medium-screen:vads-u-margin-right--0"
              icon="navigate_next"
              size={4}
            />
          )}
        </span>
      </a>
    </li>
  ));
  const slug = `mhv-c-card-${title.replaceAll(/\W+/g, '-').toLowerCase()}`;
  return (
    <div
      className={classnames(
        'vads-u-height--full',
        'vads-u-padding-x--4',
        'vads-u-padding-top--3',
        'vads-u-padding-bottom--2',
        'vads-u-background-color--gray-lightest',
      )}
    >
      <div className="vads-u-display--flex vads-u-align-items--center">
        {icon && (
          <div className={`vads-u-flex--auto ${iconClasses}`}>
            <va-icon icon={icon} size={4} />
          </div>
        )}
        <div className="vads-u-flex--fill">
          <h2 className="vads-u-margin--0" id={slug}>
            {title}
          </h2>
        </div>
      </div>
      <ul className="mhv-u-list-style--none vads-u-padding-left--0 vads-u-margin-top--2 vads-u-margin-bottom--0">
        {listItems}
      </ul>
    </div>
  );
};

NavCard.propTypes = {
  icon: PropTypes.oneOf([
    'attach_money',
    'calendar_today',
    'forum',
    'medical_services',
    'note_add',
    'pill',
  ]),
  iconClasses: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      href: PropTypes.string,
      isExternal: PropTypes.bool,
    }),
  ),
  title: PropTypes.string,
};
export default NavCard;
