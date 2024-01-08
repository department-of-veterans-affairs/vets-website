import React from 'react';

const Dashboard = () => (
  <div id="rep-dashboard" className="vads-u-margin--4">
    <div className="left vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3 vads-u-background-color--gray-lightest vads-u-margin-top--5">
      Side Navigation / Secondary Tasks
    </div>
    <div className="right vads-m-col--8 vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
      <div className="dash-header vads-u-font-size--h3">Rep VA Dashboard</div>
      <div className="nav dash-box vads-u-background-color--gray-lightest">
        Navigation
      </div>
      <div className="notif dash-box vads-u-background-color--gray-lightest">
        Notifications
      </div>
      <div className="primary dash-box vads-u-background-color--gray-lightest">
        Primary Tasks
      </div>
      <div
        className="etc dash-box vads-u-background-color--gray-lightest"
        vads-u-background-color--gray-lightest
      />
    </div>
  </div>
);

export default Dashboard;
