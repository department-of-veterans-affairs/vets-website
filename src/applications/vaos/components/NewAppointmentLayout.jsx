import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from './Breadcrumbs';

export default function NewAppointmentLayout({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Breadcrumbs>
        <Link to="new-appointment">New appointment</Link>
      </Breadcrumbs>
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <h1 className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
            New appointment
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}
