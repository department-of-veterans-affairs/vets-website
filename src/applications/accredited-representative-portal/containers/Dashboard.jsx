import PropTypes from 'prop-types';
import React from 'react';

import POARequestsWidget from '../components/POARequestsWidget/POARequestsWidget';
import { mockPOARequests } from '../mocks/mockPOARequests';

const Dashboard = () => {
  return (
    <>
      <h1 data-testid="dashboard-heading">Accredited Representative Portal</h1>
      <div data-testid="dashboard-content" className="placeholder-container">
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
    </>
  );
};

Dashboard.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default Dashboard;
