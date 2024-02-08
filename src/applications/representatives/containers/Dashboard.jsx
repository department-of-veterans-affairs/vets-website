import React from 'react';
import PropTypes from 'prop-types';

import { Notifications } from '../components/Notifications/Notifications';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

const dummyNotificationData = [
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

const Dashboard = () => (
  // <RequiredLoginView verify serviceRequired={[]} user={user}>
  <div className="dash-container">
    <h1 className="dash-header vads-u-font-size--h2 vads-u-margin-bottom--4">
      My Dashboard
    </h1>
    <div className="vads-u-display--flex">
      <aside className="vads-l-col--1">Links</aside>
      <article className="vads-l-col--11 vads-u-background-color--gray-lightest vads-u-padding--4 rounded-corners">
        <div>
          <div className="nav dash-box vads-u-background-color--white vads-u-margin-bottom--2 vads-l-col--12 rounded-corners" />
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--row">
          <div className="vads-l-col--9">
            <Notifications notifications={dummyNotificationData} />
          </div>
          <div className="vads-l-col--3 vads-u-padding-left--2">
            <div className="primary dash-box vads-u-background-color--white vads-u-margin-bottom--2 rounded-corners" />
            <div className="etc dash-box vads-u-background-color--white rounded-corners" />
          </div>
        </div>
      </article>
    </div>
  </div>
  // </RequiredLoginView>
);

Dashboard.propTypes = {
  user: PropTypes.object,
};

export default Dashboard;
