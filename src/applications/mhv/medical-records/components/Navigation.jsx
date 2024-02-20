import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SectionGuideButton from './SectionGuideButton';

const Navigation = props => {
  const { paths } = props;

  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  function checkScreenSize() {
    if (window.innerWidth <= 481 && setIsMobile !== false) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsNavigationOpen(false);
    }
  }

  function openNavigationBurgerButton() {
    return (
      isMobile && (
        <SectionGuideButton
          onMenuClick={() => {
            openNavigation();
          }}
        />
      )
    );
  }

  useEffect(
    () => {
      checkScreenSize();
    },
    [isMobile],
  );

  window.addEventListener('resize', checkScreenSize);

  const handleActiveLinksStyle = path => {
    let relativePath;
    if (path === '/' && location.pathname === '/') return 'is-active';
    const pathArr = location.pathname.slice(1).split('/');
    if (
      pathArr.length > 1 &&
      pathArr.length < 5 &&
      pathArr[0] === 'labs-and-tests'
    ) {
      relativePath = '/labs-and-tests';
    } else if (pathArr.length === 3)
      relativePath = `/${pathArr[0]}/${pathArr[1]}`;
    else relativePath = location.pathname;
    if (path === relativePath) return 'is-active';
    return '';
  };

  // We no longer have dynamically opening/closing nav, but leaving this the handleSubpathsOpen
  // function in case we add it again later.

  // const handleSubpathsOpen = path => {
  //   return location.pathname !== '/' && location.pathname.includes(path);
  // };

  const subMenu = subpaths => {
    return (
      <div className="sidebar-navigation-mr-list-menu">
        <ul className="usa-sidenav-list sub-list">
          {subpaths.map((subpath, j) => (
            <li key={j} data-testid={subpath.datatestid}>
              <Link
                className={handleActiveLinksStyle(subpath.path)}
                to={subpath.path}
              >
                <span>{subpath.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="vads-u-flex--auto vads-u-padding-bottom--3 medium-screen:vads-u-padding-bottom--0 no-print">
      {openNavigationBurgerButton()}
      {(isNavigationOpen && isMobile) || isMobile === false ? (
        <div className="sidebar-navigation">
          {isMobile && (
            <div className="sidebar-navigation-header">
              <button
                className="va-btn-close-icon"
                aria-label="Close-this-menu"
                aria-expanded="true"
                aria-controls="a1"
                onClick={closeNavigation}
                type="button"
              />
            </div>
          )}
          <div id="a1" className="sidebar-navigation-list" aria-hidden="false">
            <ul className="usa-sidenav-list">
              {paths.map((path, i) => (
                <li key={i} className="sidebar-navigation-mr-list">
                  <div className="sidebar-navigation-mr-list-header">
                    <Link
                      className={handleActiveLinksStyle(path.path)}
                      to={path.path}
                      data-testid={path.datatestid}
                    >
                      <span>{path.label}</span>
                    </Link>
                  </div>

                  {path.subpaths &&
                    // handleSubpathsOpen(path.path) &&
                    subMenu(path.subpaths)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navigation;

Navigation.propTypes = {
  paths: PropTypes.any,
};
