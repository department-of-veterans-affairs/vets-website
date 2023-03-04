import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useLocation } from 'react-router-dom';
import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import NameTag from '~/applications/personalization/components/NameTag';
import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';
import { useFeatureToggle } from '../../hooks/useFeatureToggle';
import { PROFILE_PATHS } from '../constants';

const getLayoutAndRoutes = (routes, useEditingPage, currentPathname) => {
  const filteredRoutes = [...routes].filter(
    route => route.path !== PROFILE_PATHS.EDIT,
  );
  if (useEditingPage && currentPathname === PROFILE_PATHS.EDIT) {
    return {
      routes: filteredRoutes,
      layout: 'edit',
    };
  }
  return {
    routes: filteredRoutes,
    layout: 'default',
  };
};

const ProfileWrapper = ({
  children,
  routes,
  isLOA3,
  isInMVI,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
  showNameTag,
}) => {
  const location = useLocation();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const useEditingPage = useToggleValue(
    TOGGLE_NAMES.profileUseFieldEditingPage,
  );

  const { routes: routesForNavs, layout } = getLayoutAndRoutes(
    routes,
    useEditingPage,
    location.pathname,
  );

  return (
    <>
      {showNameTag && (
        <NameTag
          totalDisabilityRating={totalDisabilityRating}
          totalDisabilityRatingServerError={totalDisabilityRatingServerError}
        />
      )}

      {layout === 'default' && (
        <>
          <div className="medium-screen:vads-u-display--none">
            <ProfileMobileSubNav
              routes={routesForNavs}
              isLOA3={isLOA3}
              isInMVI={isInMVI}
            />
          </div>

          <div className="vads-l-grid-container vads-u-padding-x--0">
            <div className="vads-l-row">
              <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--3 vads-u-padding-left--2">
                <ProfileSubNav
                  routes={routesForNavs}
                  isLOA3={isLOA3}
                  isInMVI={isInMVI}
                />
              </div>
              <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
                {/* children will be passed in from React Router one level up */}
                {children}
              </div>
            </div>
          </div>
        </>
      )}

      {layout === 'edit' && (
        <div className="vads-l-grid-container vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
              {/* children will be passed in from React Router one level up */}
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const hero = state.vaProfile?.hero;
  return {
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
    showNameTag: ownProps.isLOA3 && isEmpty(hero?.errors),
  };
};

ProfileWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node,
        PropTypes.object,
      ]).isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      requiresLOA3: PropTypes.bool.isRequired,
      requiresMVI: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  hero: PropTypes.object,
  isInMVI: PropTypes.bool,
  isLOA3: PropTypes.bool,
  location: PropTypes.object,
  showNameTag: PropTypes.bool,
  totalDisabilityRating: PropTypes.string,
  totalDisabilityRatingServerError: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfileWrapper);
