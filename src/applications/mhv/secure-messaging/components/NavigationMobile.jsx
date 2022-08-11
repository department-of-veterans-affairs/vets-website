import React from 'react';
import '../sass/navigation.scss';

export default function NavigationMobile() {
  return (
    <div className="sidebarnav">
      <ul>
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
        <ul className="usa-accordion">
          <li>
            <div id="a1" className="usa-accordion-content" aria-hidden="true">
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
                  <a href="#">Messages FAQ</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  );
}
