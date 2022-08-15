import React from 'react';

const Navigation = () => (
  <div className="side-menu-nav">
    <ul>
      <li>
        <div className="nav-title">
          <i className="medkit-icon fas fa-medkit" />
          <h4>My Health</h4>
          <button
            type="button"
            className="va-btn-close-icon"
            aria-label="Close-this-menu"
            aria-expanded="true"
            aria-controls="a1"
          />
        </div>
        <ul className="sidebar">
          <li>
            <div id="a1" className="side-nav-content" aria-hidden="false">
              <ul className="usa-sidenav-list">
                <li>
                  <a className="list-parent" href="#">
                    Messages
                  </a>
                  <ul>
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
              </ul>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
);

export default Navigation;
