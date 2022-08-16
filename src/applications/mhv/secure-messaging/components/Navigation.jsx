import { now } from 'lodash';
import React, { useState } from 'react';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
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
  function openNavigation() {
    setIsNavigationOpen(!isNavigationOpen);
  }
  return (
    <div className="side-menu-nav .messages-nav-menu">
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
              onClick={openNavigation}
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
                      isListOpen === true ? 'messages-open' : 'messages-close'
                    } `}
                  >
                    <a className="list-parent" onClick={openList} href="#">
                      Messages
                    </a>
                    <ul
                      className={`messages-list ${
                        isListOpen === true ? 'messages-open' : 'messages-close'
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
                    <a className="list-parent" href="#" aria-hidden="true" s>
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
  );
};

export default Navigation;
