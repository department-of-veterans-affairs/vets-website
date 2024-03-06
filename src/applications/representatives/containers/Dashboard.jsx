import PropTypes from 'prop-types';
import React from 'react';

import PoaRequestsWidget from '../components/PoaRequestsWidget/PoaRequestsWidget';
import { mockPOARequests } from '../mocks/mockPOARequests';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LoginViewWrapper from './LoginViewWrapper';

import { POABreadcrumbs } from '../common/breadcrumbs';

const Dashboard = ({ POAPermissions = true }) => {
  const dashboardBreadcrumbs = POABreadcrumbs('dashboard');

  return (
    <LoginViewWrapper
      breadcrumbs={dashboardBreadcrumbs}
      POAPermissions={POAPermissions}
    >
      <h1>Accredited Representative Portal</h1>
      <div className="placeholder-container">
        <div className="dash-container">
          <div className="vads-u-display--flex">
            <article className="vads-l-col--11 vads-u-background-color--gray-lightest vads-u-padding--4 rounded-corners">
              <div>
                <div className="nav dash-box vads-u-background-color--white vads-u-margin-bottom--2 vads-l-col--12 rounded-corners" />
              </div>
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <div className="vads-l-col--9">
                  <PoaRequestsWidget poaRequests={mockPOARequests} />
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
  POAPermissions: PropTypes.bool,
};

export default Dashboard;
