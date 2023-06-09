import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getFolders } from '../actions/folders';
import { folder } from '../selectors';
import SectionGuideButton from './SectionGuideButton';
import { DefaultFolders } from '../util/constants';
import { trapFocus } from '../../shared/util/ui';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();
  const activeFolder = useSelector(folder);
  const sideBarNavRef = useRef();
  const closeMenuButtonRef = useRef();
  const [navMenuButtonRef, setNavMenuButtonRef] = useState(null);

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

  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch],
  );

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
        path: '/inbox',
        label: 'Inbox',
        id: DefaultFolders.INBOX.id,
        datatestid: 'inbox-sidebar',
      },
      {
        path: '/drafts',
        label: 'Drafts',
        id: DefaultFolders.DRAFTS.id,
        datatestid: 'drafts-sidebar',
      },
      {
        path: '/sent',
        label: 'Sent',
        id: DefaultFolders.SENT.id,
        datatestid: 'sent-sidebar',
      },
      {
        path: '/trash',
        label: 'Trash',
        id: DefaultFolders.DELETED.id,
        datatestid: 'trash-sidebar',
      },
      {
        path: '/folders',
        label: 'My folders',
        datatestid: 'my-folders-sidebar',
      },

      /* Hidden from sidenav view; will implement in SM Home later */
      // {
      //   path: '/faq',
      //   label: 'Messages FAQ',
      //   datatestid: 'messages-faq-sidebar',
      // },
    ];
  };

  function checkScreenSize() {
    if (window.innerWidth <= 768 && setIsMobile !== false) {
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
          setNavMenuButtonRef={setNavMenuButtonRef}
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

  const headerStyle = location.pathname === '/' ? 'is-active' : null;

  const handleActiveLinksStyle = path => {
    let isActive = false;
    if (location.pathname === '/') {
      // Highlight Messages on Lnading page
      isActive = false;
    } else if (location.pathname === '/folders') {
      // To ensure other nav links are not bolded when landed on "/folders"
      isActive = location.pathname === path.path;
    } else if (location.pathname.split('/')[1] === 'folder') {
      // Highlight "My Folders" when landed on "/folder/:id"
      isActive = path.path === '/folders';
    } else if (location.pathname === path.path) {
      isActive = true;
    } else if (path.id !== undefined && activeFolder?.folderId === path.id) {
      // To highlight a corresponding folder when landed on "/message/:id"
      isActive = true;
    }

    return isActive ? 'is-active' : '';
  };

  return (
    <div className="secure-messaging-navigation vads-u-flex--auto vads-u-padding-bottom--7 medium-screen:vads-u-padding-bottom--0">
      {openNavigationBurgerButton()}
      {(isNavigationOpen && isMobile) || isMobile === false ? (
        <div ref={sideBarNavRef} className="sidebar-navigation">
          <div className="sr-only" aria-live="polite">
            Navigation menu is open
          </div>
          {isMobile && (
            <div className="sidebar-navigation-header">
              <button
                ref={closeMenuButtonRef}
                className="va-btn-close-icon"
                aria-label="Close-this-menu"
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
