import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs';

export default function NewAppointmentLayout({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Breadcrumbs>
        <Link to="new-express-care-request">Express Care request</Link>
      </Breadcrumbs>
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
            Express Care Request
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}
