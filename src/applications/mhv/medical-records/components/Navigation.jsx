import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SectionGuideButton from './SectionGuideButton';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();

  const healthHistoryPaths = [
    {
      path: '/health-history/care-summaries-and-notes',
      label: 'Care summaries and notes',
      datatestid: 'care-summaries-and-notes-sidebar',
    },
    {
      path: '/health-history/vaccines',
      label: 'Vaccines',
      datatestid: 'vaccines-sidebar',
    },
    {
      path: '/health-history/allergies',
      label: 'Allergies',
      datatestid: 'allergies-sidebar',
    },
    {
      path: '/health-history/health-conditions',
      label: 'Health conditions',
      datatestid: 'health-conditions-sidebar',
    },
    {
      path: '/health-history/vitals',
      label: 'Vitals',
      datatestid: 'vitals-sidebar',
    },
  ];

  const paths = [
    {
      path: '/',
      label: 'About VA medical records',
      datatestid: 'about-va-medical-records-sidebar',
    },
    {
      path: '/labs-and-tests',
      label: 'Lab and test results',
      datatestid: 'labs-and-tests-sidebar',
    },
    {
      path: '/health-history',
      label: 'Health history',
      datatestid: 'health-history-sidebar',
      subPaths: healthHistoryPaths,
    },
    {
      path: '/share-your-medical-record',
      label: 'Share your medical record',
      datatestid: 'share-your-medical-record-sidebar',
    },
  ];

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
    if (path === '/' && location.pathname === '/') return 'is-active';
    if (path !== '/' && location.pathname === path) return 'is-active';
    return '';
  };

  const subMenu = subPaths => {
    return (
      <div className="sidebar-navigation-mr-list-menu">
        <ul className="usa-sidenav-list sub-list">
          {subPaths.map((subPath, j) => (
            <li key={j} data-testid={subPath.datatestid}>
              <Link
                className={handleActiveLinksStyle(subPath.path)}
                to={subPath.path}
              >
                <span>{subPath.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="medical-records-navigation vads-u-flex--auto vads-u-padding-bottom--7 medium-screen:vads-u-padding-bottom--0">
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
                    >
                      <span>{path.label}</span>
                    </Link>
                  </div>

                  {path.subPaths && subMenu(path.subPaths)}
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
