import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import IndexLink from './IndexLink';

export default function TabItem({ className, id, shortcut, tabpath, title }) {
  const navigate = useNavigate();

  // The code if logic is a bit confusing but looks like we expect a user
  // to click the 'Alt' key + '1' OR '2' OR '3' in order for the user to
  // be directed to a given tab in the CST
  // TODO: Verify we want this logic
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
