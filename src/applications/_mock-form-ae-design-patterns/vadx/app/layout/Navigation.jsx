import React from 'react';
import { Link } from 'react-router';
import { useProcessManager } from '../../context/processManager';

// side navigation for the vadx pages
export const Navigation = () => {
  const { activeApps } = useProcessManager();
  return (
    <nav aria-label="Side navigation,">
      <ul className="usa-sidenav-list">
        <li className="usa-sidenav-item">
          <Link
            to="/vadx"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Development Servers
          </Link>

          {activeApps.length > 0 && (
            <>
              <p className="vads-u-font-size--sm vads-u-font-weight--bold vads-u-margin-y--0 vads-u-padding-y--0 vads-u-padding-left--1">
                Running frontend apps:
              </p>
              <ul className="usa-sidenav-sublist vads-u-margin-y--0 vads-u-padding-y--0">
                {activeApps.map(app => (
                  <li
                    className="vads-u-margin-y--0 vads-u-font-size--sm"
                    key={app.entryName}
                  >
                    <va-link href={`${app.rootUrl}`} text={app.appName} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
        <li className="usa-sidenav-item">
          <Link
            to="/vadx/debug"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Debug
          </Link>
        </li>
        <li className="usa-sidenav-item">
          <Link
            to="/vadx/feature-toggles"
            activeClassName="vads-u-font-weight--bold usa-current"
          >
            Feature Toggles
          </Link>
        </li>
      </ul>
    </nav>
  );
};
