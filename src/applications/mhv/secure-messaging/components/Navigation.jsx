import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getFolders } from '../actions/folders';
import SectionGuideButton from './SectionGuideButton';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();

  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch],
  );

  const paths = () => {
    return [
      { path: '/inbox', label: 'Inbox', datatestid: 'inbox-sidebar' },
      { path: '/drafts', label: 'Drafts', datatestid: 'drafts-sidebar' },
      { path: '/sent', label: 'Sent', datatestid: 'sent-sidebar' },
      { path: '/trash', label: 'Trash', datatestid: 'trash-sidebar' },
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

  // TODO this is a sample GA event call. The analytics tag below is not valid
  // const handleOnClick = path => {
  //   recordEvent({
  //     // For Google Analytics
  //     event: 'secure-messaging-navigation-clicked',
  //     'secure-messaging-navigation-option': path.label,
  //     'secure-messaging-navigation-path': path.path,
  //   });
  // };

  const headerStyle = location.pathname === '/' ? 'is-active' : null;

  const handleActiveLinksStyle = path => {
    const basePath = location.pathname.split('/');
    if (location.pathname === path.path) {
      return 'is-active';
    }
    if (path.label === 'My folders') {
      if (basePath[1] === 'message') {
        return 'vads-u-font-weight--bold';
      }
      if (basePath[1] === 'folder') {
        return 'vads-u-font-weight--bold';
      }
    }

    return undefined;
  };

  return (
    <div className="secure-messaging-navigation vads-u-padding-bottom--7 vads-u-flex--auto">
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
                          // onClick={() => {
                          //   handleOnClick(path);
                          // }}
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
