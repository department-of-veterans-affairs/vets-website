import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
// import RequiredLoginView from '~/platform/user/authorization/components/RequiredLoginView';

import Sidenav from '../components/Sidenav';

const LoginViewWrapper = ({
  breadcrumbs,
  children,
  POApermissions = false,
}) => {
  let content = null;

  // If the VSO does not have permission to be Power of Attorney ( this will eventually be pulled from Redux state)
  if (!POApermissions) {
    content = (
      <va-alert
        close-btn-aria-label="Close insufficient permission alert"
        status="info"
        visible
      >
        <h2 slot="headline">You are missing some permissions</h2>
        <div>
          <p className="vads-u-margin-y--0">
            In order to access the features of the Accredited Representative
            Portal you need to have certain permissions, such as being
            registered with the VA to accept Power of Attorney for a Veteran.
          </p>
        </div>
      </va-alert>
    );
  }

  if (POApermissions) {
    content = (
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
          <Sidenav />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          {children}
        </div>
      </div>
    );
  }
  return (
    <>
      {/* <RequiredLoginView verify serviceRequired={[]} user={user}> */}
      <va-breadcrumbs label="Breadcrumb">
        {breadcrumbs?.map(({ link, label }) => (
          <li key={link}>
            <Link to={link}>{label}</Link>
          </li>
        ))}
      </va-breadcrumbs>
      <div className="vads-u-margin-bottom--3">
        <main className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          {content}
        </main>
      </div>
      {/* </RequiredLoginView> */}
    </>
  );
};

LoginViewWrapper.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
  POApermissions: PropTypes.bool,
  user: PropTypes.object,
};

export default LoginViewWrapper;
