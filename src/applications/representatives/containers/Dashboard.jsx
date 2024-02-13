import React from 'react';
import PropTypes from 'prop-types';

// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

const Dashboard = ({ POApermissions = true }) => {
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
      <div className="vads-u-display--flex vads-u-justify-content--center">
        <aside className="left vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3 vads-u-background-color--gray-lightest" />
        <article className="vads-m-col--8 vads-l-col--12 vads-u-padding-left--5 medium-screen:vads-l-col--8 large-screen:vads-l-col--5">
          <div className="nav dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
          <div className="notif dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
          <div className="primary dash-box vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
          <div className="etc dash-box vads-u-background-color--gray-lightest" />
        </article>
      </div>
    );
  }

  return (
    // <RequiredLoginView verify serviceRequired={[]} user={user}>
    <div className="dash-container">
      <h1 className="dash-header vads-u-font-size--h2 vads-u-margin-bottom--4">
        Representative Dashboard
      </h1>
      {content}
    </div>
    // </RequiredLoginView>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  POApermissions: PropTypes.bool,
};

export default Dashboard;
