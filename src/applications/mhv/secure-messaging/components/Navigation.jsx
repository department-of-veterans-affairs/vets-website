import React from 'react';
import '../sass/navigation.scss';

export default function Navigation() {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-padding-y--2">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div
          className="vads-l-col--12 
      vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3"
        />
        <nav className="va-sidebarnav" id="va-detailpage-sidebar">
          <div>
            <button
              type="button"
              aria-label="Close this menu"
              className="va-btn-close-icon va-sidebarnav-close"
            />

            <ul>
              <div className="nav-title">
                <i className="medkit-icon fas fa-medkit" />
                <h4>My Health</h4>
                <button
                  type="button"
                  aria-label="close-button"
                  aria-expanded="false"
                  aria-controls="a1"
                >
                  <i
                    className="fas fa-times"
                    style={{
                      width: '14px',
                      color: 'black',
                    }}
                  />
                </button>
              </div>
              <li>
                <div
                  id="a1"
                  className="messages-nav-content"
                  aria-hidden="true"
                >
                  <ul className="usa-sidenav-list">
                    <li>
                      <a href="#">Messages</a>
                    </li>
                    <li>
                      <a href="#">Compose</a>
                    </li>
                    <li>
                      <a href="#">Dafts</a>
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
                      <a href="#">How to use the Messages tool</a>
                    </li>
                    <li>
                      <a href="#">Messages FAQ</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
