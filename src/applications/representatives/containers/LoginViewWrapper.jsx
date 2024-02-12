import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
// import RequiredLoginView from '~/platform/user/authorization/components/RequiredLoginView';

import Sidenav from '../components/Sidenav';

const LoginViewWrapper = ({ breadcrumbs, children }) => {
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
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
              <Sidenav />
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
              {children}
            </div>
          </div>
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
  user: PropTypes.object,
};

export default LoginViewWrapper;
