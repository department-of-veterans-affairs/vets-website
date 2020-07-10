import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import { isWideScreen } from 'platform/utilities/accessibility/index';

import ProfileHeader from './ProfileHeader';
import ProfileSideNav from './ProfileSideNav';
import MobileMenuTrigger from './MobileMenuTrigger';
import { PROFILE_PATHS } from '../constants';

const Profile2 = ({ children, routes }) => {
  const location = useLocation();
  const createBreadCrumbAttributes = () => {
    const activeLocation = location?.pathname;
    const activeRoute = routes.find(route => route.path === activeLocation);

    return { activeLocation, activeRouteName: activeRoute?.name };
  };

  const { activeLocation, activeRouteName } = createBreadCrumbAttributes();

  // We do not want to display 'Profile' on the mobile personal-information route
  const onPersonalInformationMobile =
    activeLocation === PROFILE_PATHS.PERSONAL_INFORMATION && !isWideScreen();

  return (
    <>
      {/* Breadcrumbs */}
      <div data-testid="breadcrumbs">
        <Breadcrumbs className="vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
          <a href="/">Home</a>
          {!onPersonalInformationMobile && <Link to="/">Your profile</Link>}
          <a href={activeLocation}>{activeRouteName}</a>
        </Breadcrumbs>
      </div>

      <MobileMenuTrigger />

      <div className="mobile-fixed-spacer" />
      <ProfileHeader />

      <div className="usa-grid usa-grid-full">
        <div className="usa-width-one-fourth">
          <ProfileSideNav routes={routes} />
        </div>
        <div className="usa-width-two-thirds vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-u-padding--0 medium-screen:vads-u-padding-bottom--6">
          {/* children will be passed in from React Router one level up */}
          {children}
        </div>
      </div>
    </>
  );
};

Profile2.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      requiresLOA3: PropTypes.bool.isRequired,
      requiresMVI: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default Profile2;
