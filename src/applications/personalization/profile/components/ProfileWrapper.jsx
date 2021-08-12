import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import { selectProfile } from '~/platform/user/selectors';

import {
  cnpDirectDepositLoadError,
  eduDirectDepositLoadError,
  fullNameLoadError,
  militaryInformationLoadError,
  personalInformationLoadError,
} from '@@profile/selectors';

import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import NameTag from '~/applications/personalization/components/NameTag';
import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';

const NotAllDataAvailableError = () => (
  <div data-testid="not-all-data-available-error">
    <AlertBox
      level={2}
      status="warning"
      headline="We can’t load all the information in your profile"
      className="vads-u-margin-bottom--4"
    >
      <p>
        We’re sorry. Something went wrong on our end. We can’t display all the
        information in your profile. Please refresh the page or try again later.
      </p>
    </AlertBox>
  </div>
);

const ProfileWrapper = ({
  children,
  routes,
  isLOA3,
  isInMVI,
  showNotAllDataAvailableError,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
  showUpdatedNameTag,
  showNameTag,
}) => {
  const location = useLocation();
  const createBreadCrumbAttributes = () => {
    const activeLocation = location?.pathname;
    const activeRoute = routes.find(route => route.path === activeLocation);

    return { activeLocation, activeRouteName: activeRoute?.name };
  };

  const { activeLocation, activeRouteName } = createBreadCrumbAttributes();

  return (
    <>
      {showNameTag &&
        showUpdatedNameTag && (
          <NameTag
            showUpdatedNameTag
            totalDisabilityRating={totalDisabilityRating}
            totalDisabilityRatingServerError={totalDisabilityRatingServerError}
          />
        )}

      {/* Breadcrumbs */}
      <div
        data-testid="breadcrumbs"
        className="vads-l-grid-container vads-u-padding-x--0"
      >
        <Breadcrumbs className="vads-u-padding-x--1 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0 medium-screen:vads-u-padding-x--2">
          <a href="/">Home</a>
          <a href={activeLocation}>{`Profile: ${activeRouteName}`}</a>
        </Breadcrumbs>
      </div>

      {showNameTag && !showUpdatedNameTag && <NameTag />}

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

const mapStateToProps = (state, ownProps) => {
  const veteranStatus = selectProfile(state)?.veteranStatus;
  const invalidVeteranStatus =
    !veteranStatus || veteranStatus.status === 'NOT_AUTHORIZED';
  const hero = state.vaProfile?.hero;

  return {
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
    showNameTag: ownProps.isLOA3 && isEmpty(hero?.errors),
    showNotAllDataAvailableError:
      !!cnpDirectDepositLoadError(state) ||
      !!eduDirectDepositLoadError(state) ||
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
