import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import LoginViewWrapper from './LoginViewWrapper';

const Dashboard = ({ POApermissions = true }) => {
  const breadcrumbs = [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
  ];
  let content = null;

  // If the VSO does not have permission to be Power of Attorney ( this will eventually be pulled from Redux state)
  if (!POApermissions) {
    content = (
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          You are missing some permissions
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            In order to access the features of the VSO portal you need to have
            certain permissions, such as being registered with the VA to accept
            Power of Attorney for a Veteran.
          </p>
        </div>
      </va-alert>
    );
  }

  if (POApermissions) {
    content = (
      <div className="placeholder-container">
        <div className="notif vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="primary vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="etc vads-u-background-color--gray-lightest" />
      </div>
    );
  }

  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs}>
      <h1>Accredited Representative Portal</h1>
      <Link
        to="/poa-requests"
        className="vads-c-action-link--green vads-u-margin-bottom--2"
      >
        Manage power of attorney requests
      </Link>
      {content}
    </LoginViewWrapper>
  );
};

Dashboard.propTypes = {
  POApermissions: PropTypes.bool,
  user: PropTypes.object,
};

export default Dashboard;
