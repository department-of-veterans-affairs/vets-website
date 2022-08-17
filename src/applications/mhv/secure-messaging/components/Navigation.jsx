import { now } from 'lodash';
import React, { useState } from 'react';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  function openNavigation() {
    setIsNavigationOpen(true);
  }
  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  function openList() {
    setIsListOpen(!isListOpen);
  }

  function screenResize() {
    if (window.innerWidth <= 481 && setIsMobile !== false) {
      setIsMobile(true);
      console.log('mobile now');
    } else {
      setIsMobile(false);
      console.log('desktop now');
    }
  }
  window.addEventListener('resize', screenResize);
  // function openNavigation() {
  //   setIsNavigationOpen(!isNavigationOpen);
  // }
  return (
    <>
      {isMobile ? (
        <div className="va-btn-sidebarnav-trigger">
          <div className="button-background" />
          <div className="button-wrapper">
            <button
              aria-controls="va-detailpage-sidebar"
              onClick={openNavigation}
            >
              <strong>In the Messages section</strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="16"
                viewBox="0 0 448 512"
              >
                <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {isNavigationOpen === true || isMobile === false ? (
        <div className="side-menu-nav .messages-nav-menu ">
          <ul>
            <li>
              <div className="nav-title">
                <i className="medkit-icon fas fa-medkit" />
                <h4>My Health</h4>
                <button
                  type="button"
                  className={
                    isMobile === true ? 'va-btn-close-icon' : 'no-close-btn'
                  }
                  aria-label="Close-this-menu"
                  aria-expanded="true"
                  aria-controls="a1"
                  onClick={closeNavigation}
                />
              </div>
              <ul className="sidebar">
                <li>
                  <div id="a1" className="side-nav-content" aria-hidden="false">
                    <ul className="usa-sidenav-list">
                      <li>
                        <a className="list-parent" href="#" aria-hidden="true">
                          Pharmacy
                        </a>
                      </li>
                      <li>
                        <a className="list-parent" href="#" aria-hidden="true">
                          Appointments
                        </a>
                      </li>
                      <li
                        className={`messages ${
                          isListOpen === true
                            ? 'messages-open'
                            : 'messages-close'
                        } `}
                      >
                        <a className="list-parent" onClick={openList} href="#">
                          Messages
                        </a>
                        <ul
                          className={`messages-list ${
                            isListOpen === true
                              ? 'messages-open'
                              : 'messages-close'
                          } `}
                        >
                          <li>
                            <a href="#">Compose</a>
                          </li>
                          <li>
                            <a href="#">Drafts</a>
                          </li>
                          <li>
                            <a href="#">Folders</a>
                          </li>
                          <li>
                            <a href="#">Sent</a>
                          </li>
                          <li>
                            <a href="#">Deleted</a>
                          </li>
                          <li>
                            <a href="#">Search Messages</a>
                          </li>
                          <li>
                            <a href="#">Messages FAQ</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a className="list-parent" href="#" aria-hidden="true">
                          Medical Records
                        </a>
                      </li>
                      <li>
                        <a className="list-parent" href="#" aria-hidden="true">
                          VA health care benefits
                        </a>
                      </li>
                      <li>
                        <a className="list-parent" href="#" aria-hidden="true">
                          Copay bills and travel pay
                        </a>
                      </li>
                      <li>
                        <a
                          className="list-parent"
                          href="#"
                          aria-hidden="true"
                          s
                        >
                          Health resources
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navigation;
