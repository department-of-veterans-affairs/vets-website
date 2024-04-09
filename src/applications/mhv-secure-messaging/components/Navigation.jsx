import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { trapFocus } from '@department-of-veterans-affairs/mhv/exports';
import { folder } from '../selectors';
import SectionGuideButton from './SectionGuideButton';
import { DefaultFolders, Paths } from '../util/constants';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();
  const activeFolder = useSelector(folder);
  const sideBarNavRef = useRef();
  const closeMenuButtonRef = useRef();
  const [navMenuButtonRef, setNavMenuButtonRef] = useState(null);

  const checkScreenSize = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsNavigationOpen(false);
    }
  }, []);

  window.addEventListener('resize', checkScreenSize);

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  const closeNavigation = useCallback(
    () => {
      setIsNavigationOpen(false);
      focusElement(navMenuButtonRef);
    },
    [navMenuButtonRef],
  );

  useEffect(() => {
    checkScreenSize();
  }, []);

  useEffect(
    () => {
      if (isNavigationOpen) {
        focusElement(closeMenuButtonRef.current);
        trapFocus(
          sideBarNavRef.current,
          `a[href]:not([disabled]), button:not([disabled])`,
          closeNavigation,
        );
      }
    },
    [isNavigationOpen, closeMenuButtonRef, sideBarNavRef, closeNavigation],
  );

  const paths = () => {
    return [
      {
        path: Paths.INBOX,
        label: 'Inbox',
        id: DefaultFolders.INBOX.id,
        datatestid: 'inbox-sidebar',
      },
      {
        path: Paths.DRAFTS,
        label: 'Drafts',
        id: DefaultFolders.DRAFTS.id,
        datatestid: 'drafts-sidebar',
      },
      {
        path: Paths.SENT,
        label: 'Sent',
        id: DefaultFolders.SENT.id,
        datatestid: 'sent-sidebar',
      },
      {
        path: Paths.DELETED,
        label: 'Trash',
        id: DefaultFolders.DELETED.id,
        datatestid: 'trash-sidebar',
      },
      {
        path: Paths.FOLDERS,
        label: 'My folders',
        datatestid: 'my-folders-sidebar',
      },
    ];
  };

  const headerStyle = location.pathname === '/' ? 'is-active' : null;

  const handleActiveLinksStyle = path => {
    let isActive = false;
    if (location.pathname === '/') {
      // Highlight Messages on Lnading page
      isActive = false;
    } else if (location.pathname === Paths.FOLDERS) {
      // To ensure other nav links are not bolded when landed on "/folders"
      isActive = location.pathname === path.path;
    } else if (location.pathname.split('/')[1] === 'folders') {
      // Highlight "My Folders" when landed on "/folders/:id"
      isActive = path.path === Paths.FOLDERS;
    } else if (location.pathname === path.path) {
      isActive = true;
    } else if (path.id !== undefined && activeFolder?.folderId === path.id) {
      // To highlight a corresponding folder when landed on "/message/:id"
      isActive = true;
    }

    return isActive ? 'is-active' : '';
  };

  return (
    <div
      className="navigation-container
      vads-l-col--12
      medium-screen:vads-l-col--3
      vads-u-padding-bottom--2
      medium-screen:vads-u-padding-bottom--0
      medium-screen:vads-u-padding-right--3
      do-not-print"
    >
      {isMobile && (
        <SectionGuideButton
          setNavMenuButtonRef={setNavMenuButtonRef}
          onMenuClick={() => {
            openNavigation();
          }}
          isExpanded={isNavigationOpen}
        />
      )}

      {(isNavigationOpen && isMobile) || isMobile === false ? (
        <div
          ref={sideBarNavRef}
          className="sidebar-navigation vads-u-display--flex vads-u-flex-direction--column"
          id="sidebar-navigation"
        >
          <div className="sr-only" aria-live="polite">
            Navigation menu is open
          </div>
          {isMobile && (
            <div
              className="sidebar-navigation-header
                vads-u-display--flex
                vads-u-flex-direction--row
                vads-u-justify-content--flex-end"
            >
              <button
                ref={closeMenuButtonRef}
                className="va-btn-close-icon vads-u-margin--0p5 vads-u-padding--2p5 vads-u-margin-right--2"
                aria-label="Close navigation menu"
                aria-expanded="true"
                aria-controls="a1"
                onClick={closeNavigation}
                type="button"
              />
            </div>
          )}
          <div id="a1" className="sidebar-navigation-list">
            <ul className="usa-sidenav-list">
              <li className="sidebar-navigation-messages-list">
                <div className="sidebar-navigation-messages-list-header">
                  {/* Message Link will navigate to the new SM Home page in the future */}
                  <Link className={headerStyle} to="/">
                    <span>Messages</span>
                  </Link>
                </div>

                <div className="sidebar-navigation-messages-list-menu">
                  <ul className="usa-sidenav-list sub-list">
                    {paths().map((path, i) => (
                      <li key={i} data-testid={path.datatestid}>
                        <Link
                          className={handleActiveLinksStyle(path)}
                          to={path.path}
                          onClick={() => {
                            closeNavigation();
                          }}
                        >
                          <span>{path.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
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
