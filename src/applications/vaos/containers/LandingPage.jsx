import React from 'react';
import { Link } from 'react-router';

const LandingPage = () => (
  <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <div>
          <h1>VA Appointments</h1>
          <h2 className="vads-u-font-size--base vads-u-font-weight--normal">
            Get started
          </h2>
          <ul className="usa-unstyled-list">
            <li>
              <Link
                to="new-appointment"
                className="vads-u-display--flex vads-u-align-items--center"
              >
                <div className="vads-u-flex--auto">
                  <i className="fas fa-plus" />
                </div>
                <div className="vads-u-flex--1">
                  <h3>Create a new appointment</h3>
                  Create a new appointment at a VA Medical center, clinic, or
                  Community Care facility
                </div>
                <div className="vads-u-flex--auto">
                  <i className="fas fa-angle-right" />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default LandingPage;
