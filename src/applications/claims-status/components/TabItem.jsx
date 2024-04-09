import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import IndexLink from './IndexLink';

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
      <IndexLink
        id={`tab${id || title}`}
        activeClassName="tab--current"
        className="tab"
        to={tabpath}
      >
        <span>{title}</span>
      </IndexLink>
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
