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
    <div className="vads-u-height--full vads-u-padding-x--5 vads-u-padding-y--3 vads-u-background-color--gray-lightest">
      <h2 className="vads-u-margin-top--1">
        {icon && <i className={`fas fa-${icon} vads-u-margin-right--1`} />}{' '}
        {title}
      </h2>
      <nav>
        <ul className="mhv-u-list-style--none vads-u-padding-left--0">
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
