import React, { useEffect, useState } from 'react';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
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
    return isMobile ? (
      <div className="va-btn-sidebarnav-trigger">
        <div className="button-background" />
        <div className="button-wrapper">
          <button
            aria-controls="va-detailpage-sidebar"
            onClick={openNavigation}
            type="button"
          >
            <strong>In the Messages section</strong>
            <i className="fas fa-bars" aria-hidden />
          </button>
        </div>
      </div>
    ) : (
      <></>
    );
  }

  useEffect(
    () => {
      checkScreenSize();
    },
    [isMobile],
  );

  window.addEventListener('resize', checkScreenSize);

  return (
    <>
      {openNavigationBurgerButton()}
      {(isNavigationOpen && isMobile) || isMobile === false ? (
        <div className="sidebar-navigation">
          <div className="sidebar-navigation-header">
            <i className="medkit-icon fas fa-medkit" />
            <h4>My Health</h4>
            <button
              className={
                isMobile === true ? 'va-btn-close-icon' : 'no-close-btn'
              }
              aria-label="Close-this-menu"
              aria-expanded="true"
              aria-controls="a1"
              onClick={closeNavigation}
              type="button"
            />
          </div>
          <div id="a1" className="sidebar-navigation-list" aria-hidden="false">
            <ul className="usa-sidenav-list">
              <li>
                <a href="/my-health/secure-messages">Pharmacy</a>
              </li>
              <li>
                <a href="/my-health/secure-messages">Appointments</a>
              </li>
              <li className="sidebar-navigation-messages-list">
                <div className="sidebar-navigation-messages-list-header">
                  <a href="/my-health/secure-messages">Messages</a>
                </div>
                <div className="sidebar-navigation-messages-list-menu">
                  <ul className="usa-sidenav-list">
                    <li>
                      <a href="/my-health/secure-messages">Compose</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Drafts</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Folders</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Sent</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Deleted</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Search messages</a>
                    </li>
                    <li>
                      <a href="/my-health/secure-messages">Messages FAQ</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="/my-health/secure-messages">Medical records</a>
              </li>
              <li>
                <a href="/my-health/secure-messages">VA health care benefits</a>
              </li>
              <li>
                <a href="/my-health/secure-messages">
                  Copay bills and travel pay
                </a>
              </li>
              <li>
                <a href="/my-health/secure-messages">Health resources</a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navigation;
