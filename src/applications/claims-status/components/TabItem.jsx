import React, { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom-v5-compat';

import NavLink from '../utils/NavLink';

export default function TabItem({ className, id, shortcut, tabpath, title }) {
  const { pathname: locationPathname } = useLocation();
  const navigate = useNavigate();
  const { pathname: toPathname } = useResolvedPath(tabpath);

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

  const isActive = locationPathname === toPathname;

  return (
    <li className={className} role="presentation">
      <NavLink
        id={`tab${id || title}`}
        aria-controls={isActive ? `tabPanel${id || title}` : null}
        aria-selected={isActive}
        role="tab"
        className="va-tab-trigger"
        activeClassName="va-tab-trigger--current"
        to={tabpath}
      >
        {title}
      </NavLink>
    </li>
  );
}
