import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import PoaRequestsWidget from '../components/PoaRequestsWidget/PoaRequestsWidget';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

const dummyPoaRequestData = [
  {
    name: 'John Smith',
    id: 12345,
    date: '24 JAN 2024 09:00AM',
  },
  {
    name: 'Madaline Rouge',
    id: 12345,
    date: '25 JAN 2024 09:00AM',
  },
  {
    name: 'Arnold R. Ford',
    id: 12345,
    date: '30 JAN 2024 10:00AM',
  },
];

import LoginViewWrapper from './LoginViewWrapper';

const Dashboard = ({ POApermissions = true }) => {
  const breadcrumbs = [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs} POApermissions={POApermissions}>
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
                  <PoaRequestsWidget poaRequests={dummyPoaRequestData} />
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
  POApermissions: PropTypes.bool,
};

export default Dashboard;
