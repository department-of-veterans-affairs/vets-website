import React from 'react';
import PropTypes from 'prop-types';
import AppointmentsTable from '../components/AppointmentsTable';
import Alert from '../components/Alert';
import BreadCrumbs from '../components/Breadcrumbs';

export default function App({ children }) {
  App.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <BreadCrumbs />
      <h1 tabIndex="-1" data-testid="header">
        Beneficiary Travel Self Service
      </h1>
      <p className="va-introtext">Lead text</p>
      <p>Body text</p>
      <Alert />
      <br />

      <main>
        <AppointmentsTable />
      </main>

      {children}
    </div>
  );
}
