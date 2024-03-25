import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import NavLink from './NavLink';

export default function TabItem({ className, id, shortcut, tabpath, title }) {
  const navigate = useNavigate();

  const tabShortcut = evt => {
    if (evt.altKey && evt.which === 48 + shortcut) {
      navigate(tabpath);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', tabShortcut);

    return () => {
      document.removeEventListener('keydown', tabShortcut);
    };
  });

  return (
    <li className={className}>
      <NavLink
        id={`tab${id || title}`}
        activeClassName="tab--current"
        className="tab"
        to={tabpath}
      >
        <span>{title}</span>
      </NavLink>
    </li>
  );
}

TabItem.propTypes = {
  tabpath: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  shortcut: PropTypes.number,
  title: PropTypes.string,
};
