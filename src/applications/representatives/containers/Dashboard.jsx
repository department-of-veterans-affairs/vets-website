import React from 'react';
import PropTypes from 'prop-types';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

const Dashboard = () => (
  // <RequiredLoginView verify serviceRequired={[]} user={user}>
  <div className="dash-container">
    <h1 className="dash-header vads-u-font-size--h2 vads-u-margin-bottom--4">
      Representative Dashboard
    </h1>
    <div className="vads-u-display--flex vads-u-justify-content--center">
      <aside className="left vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3 vads-u-background-color--gray-lightest" />
      <article className="vads-m-col--8 vads-l-col--12 vads-u-padding-left--5 medium-screen:vads-l-col--8 large-screen:vads-l-col--5">
        <div className="nav dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="notif dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="primary dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="etc dash-box vads-u-background-color--gray-lightest" />
      </article>
    </div>
  </div>
  // </RequiredLoginView>
);

Dashboard.propTypes = {
  user: PropTypes.object,
};

export default Dashboard;
