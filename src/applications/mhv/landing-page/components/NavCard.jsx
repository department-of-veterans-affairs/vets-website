import React from 'react';
import PropTypes from 'prop-types';

const NavCard = ({ icon = null, title, links }) => {
  const listItems = links.map(l => (
    <li className="mhv-c-navlistitem" key={l.href}>
      <a className="mhv-c-navlink" href={l.href}>
        {l.text}
        <i aria-hidden="true" />
      </a>
    </li>
  ));
  return (
    <div className="vads-u-height--full vads-u-padding-x--5 vads-u-padding-top--3 vads-u-padding-bottom--2 vads-u-background-color--gray-lightest">
      <div className="vads-u-display--flex vads-u-align-items--start">
        {icon && (
          <div className="vads-u-flex--auto vads-u-margin-right--1p5 small-screen:vads-u-margin-top--0p5">
            <div role="img" className={`fas fa-${icon} vads-u-font-size--h2`} />
          </div>
        )}
        <div className="vads-u-flex--fill">
          <h2 className="vads-u-margin--0">{title}</h2>
        </div>
      </div>
      <nav>
        <ul className="mhv-u-list-style--none vads-u-padding-left--0 vads-u-margin-top--2 vads-u-margin-bottom--0">
          {listItems}
        </ul>
      </nav>
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
    PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
  ),
  title: PropTypes.string,
};

export default NavCard;
