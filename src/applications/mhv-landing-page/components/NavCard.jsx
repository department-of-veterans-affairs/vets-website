import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

export const externalLinkText = '(opens in new tab)';

/**
 * A navigation card.
 * @param {string} icon an optional icon to display to the left of the title
 * @param {string} iconClasses an optional style for the icon
 * @param {string} introduction an optional introduction text to display below the title
 * @param {string} links optional links display in the card
 * @param {string} title the title for the navigation card
 * @param {string} tag an optional tag to display to the right of the title
 */
const NavCard = ({
  icon = null,
  iconClasses = 'vads-u-margin-right--1p5',
  introduction,
  title,
  links,
  tag,
}) => {
  const listItems = links?.map(
    ({ ariaLabel, href, text, isExternal, omitExternalLinkText }) => (
      <li className="mhv-c-navlistitem" key={href}>
        <a
          className={isExternal ? 'mhv-c-navlink-external' : 'mhv-c-navlink'}
          href={href}
          aria-label={ariaLabel}
          target={isExternal && !omitExternalLinkText ? '_blank' : ''}
          onClick={() => {
            datadogRum.addAction(`Click on Landing Page: ${title} - ${text}`);
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': text,
              'links-list-section-header': title,
            });
          }}
          rel="noreferrer"
        >
          <span
            className={ariaLabel?.includes('unread') ? 'mhv-c-indicator' : ''}
          >
            {text} {isExternal && !omitExternalLinkText && externalLinkText}
          </span>
          {!isExternal && <va-icon icon="navigate_next" size={4} />}
        </a>
      </li>
    ),
  );
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
      <div className="vads-l-row vads-u-margin-right--neg1">
        <div className="vads-u-display--flex vads-u-align-items--center">
          {icon && (
            <div className={`vads-u-flex--auto ${iconClasses}`}>
              <va-icon icon={icon} size={4} />
            </div>
          )}
          <div className="vads-u-flex--fill vads-u-margin-right--1p5">
            <h2 className="vads-u-margin--0" id={slug}>
              {title}
            </h2>
          </div>
        </div>
        {tag && (
          <div className="vads-u-margin-top--1">
            <span
              className={classnames(
                'usa-label',
                'vads-u-background-color--primary',
                'vads-u-display--none',
                'medium-screen:vads-u-display--block',
              )}
            >
              {tag}
            </span>
          </div>
        )}
      </div>
      {tag && (
        <p>
          <span
            className={classnames(
              'usa-label',
              'vads-u-background-color--primary',
              'vads-u-display--inline-block',
              'medium-screen:vads-u-display--none',
            )}
          >
            {tag}
          </span>
        </p>
      )}
      {introduction && (
        <p
          className={classnames(
            'vads-u-padding-left--0',
            'vads-u-margin-top--2',
            'vads-u-margin-bottom--0',
            'vads-u-font-size--lg',
          )}
        >
          {introduction}
        </p>
      )}
      {listItems && (
        <ul
          className={classnames(
            'mhv-u-list-style--none',
            'vads-u-padding-left--0',
            'vads-u-margin-bottom--0',
            {
              'vads-u-margin-top--2': !introduction,
              'vads-u-margin-top--0': introduction,
            },
          )}
        >
          {listItems}
        </ul>
      )}
    </div>
  );
};

NavCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOf([
    'attach_money',
    'calendar_today',
    'forum',
    'medical_services',
    'note_add',
    'pill',
  ]),
  iconClasses: PropTypes.string,
  introduction: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      href: PropTypes.string,
      isExternal: PropTypes.bool,
      omitExternalLinkText: PropTypes.bool,
    }),
  ),
  tag: PropTypes.string,
};
export default NavCard;
