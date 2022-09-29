import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFolders } from '../actions/folders';
import SectionGuideButton from './SectionGuideButton';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const folderList = useSelector(state => state.sm.folders.folderList);

  useEffect(() => {
    dispatch(getFolders());
  });

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
      <SectionGuideButton
        onMenuClick={() => {
          openNavigation();
        }}
      />
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
    <div className="secure-messaging-navigation">
      {openNavigationBurgerButton()}
      {(isNavigationOpen && isMobile) || isMobile === false ? (
        <div className="sidebar-navigation">
          <div className="sidebar-navigation-header">
            <i className="medkit-icon fas fa-medkit" aria-hidden="true" />
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
                  <Link to="/">Messages</Link>
                </div>
                {folderList && (
                  <div className="sidebar-navigation-messages-list-menu">
                    <ul className="usa-sidenav-list">
                      <li>
                        <Link to="/compose">Compose</Link>
                      </li>

                      {folderList
                        ?.filter(el => el.id !== 0)
                        .map((folder, i) => (
                          <li key={i}>
                            <Link to={`/folder/${folder.id}`}>
                              {folder.name}
                            </Link>
                          </li>
                        ))}

                      <li>
                        <Link to="/search">Search messages</Link>
                      </li>
                      <li>
                        <a href="/my-health/secure-messages">Messages FAQ</a>
                      </li>
                    </ul>
                  </div>
                )}
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
    </div>
  );
};

export default Navigation;
