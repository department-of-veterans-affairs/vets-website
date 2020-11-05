import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

import { isWideScreen } from '~/platform/utilities/accessibility/index';
import { selectProfile } from '~/platform/user/selectors';

import {
  directDepositLoadError,
  fullNameLoadError,
  militaryInformationLoadError,
  personalInformationLoadError,
} from '@@profile/selectors';

import ProfileHeader from './ProfileHeader';
import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';
import { PROFILE_PATHS } from '../constants';
import { isEmpty } from 'lodash';

const NotAllDataAvailableError = () => (
  <div data-testid="not-all-data-available-error">
    <AlertBox
      status="warning"
      headline="We can’t load all of your information"
      className="vads-u-margin-bottom--4"
    >
      <p>
        We’re sorry. Something went wrong on our end. We can’t display all the
        information on this page. Please refresh the page or try again later.
      </p>
    </AlertBox>
  </div>
);

const ProfileWrapper = ({
  children,
  routes,
  isLOA3,
  isInMVI,
  hero,
  showNotAllDataAvailableError,
}) => {
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

  // Without a verified identity, we want to show 'Home - Account Security'
  const showLOA1BreadCrumb =
    (!isLOA3 || !isInMVI) && activeLocation === PROFILE_PATHS.ACCOUNT_SECURITY;

  return (
    <>
      {/* Breadcrumbs */}
      <div data-testid="breadcrumbs">
        <Breadcrumbs className="vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
          <a href="/">Home</a>

          {showLOA1BreadCrumb && (
            <Link to="/">Your profile - Account security</Link>
          )}

          {!showLOA1BreadCrumb &&
            !onPersonalInformationMobile && <Link to="/">Your profile</Link>}

          {!showLOA1BreadCrumb && (
            <a href={activeLocation}>{activeRouteName}</a>
          )}
        </Breadcrumbs>
      </div>

      {isEmpty(hero.errors) && <ProfileHeader />}

      <div className="medium-screen:vads-u-display--none">
        <ProfileMobileSubNav
          routes={routes}
          isLOA3={isLOA3}
          isInMVI={isInMVI}
        />
      </div>

      <div className="vads-l-grid-container vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--3 vads-u-padding-left--2">
            <ProfileSubNav routes={routes} isLOA3={isLOA3} isInMVI={isInMVI} />
          </div>
          <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
            {showNotAllDataAvailableError && <NotAllDataAvailableError />}
            {/* children will be passed in from React Router one level up */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  const veteranStatus = selectProfile(state)?.veteranStatus;
  const invalidVeteranStatus =
    !veteranStatus || veteranStatus === 'NOT_AUTHORIZED';

  return {
    hero: state.vaProfile?.hero,
    showNotAllDataAvailableError:
      !!directDepositLoadError(state) ||
      !!fullNameLoadError(state) ||
      !!personalInformationLoadError(state) ||
      (!!militaryInformationLoadError(state) && !invalidVeteranStatus),
  };
};

ProfileWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
  hero: PropTypes.object,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      requiresLOA3: PropTypes.bool.isRequired,
      requiresMVI: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  showNotAllDataAvailableError: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(ProfileWrapper);
