import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const NavCard = ({ icon = null, title, links }) => {
  const listItems = links.map(({ ariaLabel, href, text }) => (
    <li className="mhv-c-navlistitem" key={href}>
      <a
        className="mhv-c-navlink"
        href={href}
        aria-label={ariaLabel}
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': text,
            'links-list-section-header': title,
          });
        }}
      >
        <span
          className={ariaLabel?.includes('unread') ? 'mhv-c-indicator' : ''}
        >
          {text}
        </span>
        <i aria-hidden="true" />
      </a>
    </li>
  ));
  const slug = `mhv-c-card-${title.replaceAll(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="vads-u-height--full vads-u-padding-x--5 vads-u-padding-top--4 vads-u-padding-bottom--2 vads-u-background-color--gray-lightest">
      <div className="vads-u-display--flex vads-u-align-items--start">
        {icon && (
          <div className="vads-u-flex--auto vads-u-margin-right--1p5 small-screen:vads-u-margin-top--0p5">
            <div
              aria-hidden="true"
              className={`fas fa-${icon} vads-u-font-size--h2`}
            />
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
    'calendar',
    'comments',
    'deaf',
    'dollar-sign',
    'file-medical',
    'prescription-bottle',
  ]),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      href: PropTypes.string,
    }),
  ),
  title: PropTypes.string,
};
export default NavCard;
