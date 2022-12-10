import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom-v5-compat';

// Grab the current URL, trim the leading '/', and return activeTabPath
const trimCurrentUrl = location => location.pathname.slice(1);

export default function TabItem({ className, id, shortcut, tabpath, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = trimCurrentUrl(location);

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
    <li className={className} role="presentation">
      <NavLink
        id={`tab${id || title}`}
        aria-controls={activeTab === tabpath ? `tabPanel${id || title}` : null}
        aria-selected={activeTab === tabpath}
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
