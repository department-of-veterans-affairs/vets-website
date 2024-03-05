import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import POARequestsWidget from '../components/POARequestsWidget/POARequestsWidget';
import { mockPOARequests } from '../mocks/mockPOARequests';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LoginViewWrapper from './LoginViewWrapper';

const Dashboard = ({ poaPermissions = true }) => {
  const breadcrumbs = [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs} poaPermissions={poaPermissions}>
      <h1>Accredited Representative Portal</h1>
      <Link
        to="/poa-requests"
        className="vads-c-action-link--green vads-u-margin-bottom--2"
      >
        Manage power of attorney requests
      </Link>
      <div className="placeholder-container">
        <div className="dash-container">
          <div className="vads-u-display--flex">
            <article className="vads-l-col--11 vads-u-background-color--gray-lightest vads-u-padding--4 rounded-corners">
              <div>
                <div className="nav dash-box vads-u-background-color--white vads-u-margin-bottom--2 vads-l-col--12 rounded-corners" />
              </div>
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <div className="vads-l-col--9">
                  <POARequestsWidget poaRequests={mockPOARequests} />
                </div>
                <div className="vads-l-col--3 vads-u-padding-left--2">
                  <div className="primary dash-box vads-u-background-color--white vads-u-margin-bottom--2 rounded-corners" />
                  <div className="etc dash-box vads-u-background-color--white rounded-corners" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </LoginViewWrapper>
  );
};

Dashboard.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default Dashboard;
