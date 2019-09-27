import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from './Breadcrumbs';

export default function LandingPage() {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      <Breadcrumbs />
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
          <div>
            <h1>VA Appointments</h1>
            <h2 className="vads-u-font-size--sm vads-u-font-family--sans vads-u-font-weight--normal">
              Get started
            </h2>
            <ul className="usa-unstyled-list">
              <li className="vads-u-border-top--1px vads-u-border-color--gray-lighter">
                <Link
                  to="new-appointment"
                  className="vads-u-text-decoration--none vads-u-color--base vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center"
                >
                  <div className="vads-u-flex--auto vads-u-margin-right--2 vads-u-display--none medium-screen:vads-u-display--block">
                    <i className="vaos-option-list__icon fas fa-plus" />
                  </div>
                  <div className="vads-u-flex--1">
                    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-font-size--lg">
                      Create a new appointment
                    </h3>
                    Create a new appointment at a VA Medical center, clinic, or
                    Community Care facility
                  </div>
                  <div className="vads-u-flex--auto vads-u-margin-left--2">
                    <i className="vads-u-color--primary vads-u-font-size--xl fas fa-angle-right" />
                  </div>
                </Link>
              </li>
              <li className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
                <Link
                  to="appointments"
                  className="vads-u-text-decoration--none vads-u-color--base vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center"
                >
                  <div className="vads-u-flex--auto vads-u-margin-right--2 vads-u-display--none medium-screen:vads-u-display--block">
                    <i className="vaos-option-list__icon fas fa-calendar-alt" />
                  </div>
                  <div className="vads-u-flex--1">
                    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-font-size--lg">
                      View your appointments
                    </h3>
                    View confirmed, pending, or past appointments
                  </div>
                  <div className="vads-u-flex--auto vads-u-margin-left--2">
                    <i className="vads-u-color--primary vads-u-font-size--xl fas fa-angle-right" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
