import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getFolders } from '../actions/folders';
import { folder } from '../selectors';
import SectionGuideButton from './SectionGuideButton';
import { DefaultFolders, Paths } from '../util/constants';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();
  const activeFolder = useSelector(folder);

  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch],
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

      /* Hidden from sidenav view; will implement in SM Home later */
      // {
      //   path: '/faq',
      //   label: 'Messages FAQ',
      //   datatestid: 'messages-faq-sidebar',
      // },
    ];
  };

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

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
    } else if (location.pathname === Paths.FOLDERS) {
      // To ensure other nav links are not bolded when landed on "/folders"
      isActive = location.pathname === path.path;
    } else if (location.pathname.split('/')[1] === 'folder') {
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
    <div className="secure-messaging-navigation vads-u-flex--auto vads-u-padding-bottom--7 medium-screen:vads-u-padding-bottom--0">
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
