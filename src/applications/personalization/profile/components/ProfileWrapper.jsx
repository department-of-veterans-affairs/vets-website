import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useLocation } from 'react-router-dom';
import NameTag from '~/applications/personalization/components/NameTag';
import { hasTotalDisabilityServerError } from '../../common/selectors/ratedDisabilities';

import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';
import { PROFILE_PATHS } from '../constants';
import { ProfileFullWidthContainer } from './ProfileFullWidthContainer';
import { getRoutesForNav } from '../routesForNav';
import { normalizePath } from '../../common/helpers';
import { ProfileBreadcrumbs } from './ProfileBreadcrumbs';
import { ProfilePrivacyPolicy } from './ProfilePrivacyPolicy';

const LAYOUTS = {
  SIDEBAR: 'sidebar',
  FULL_WIDTH: 'full-width',
};

// we want to use a different layout for the specific routes
// the profile hub and edit page are full width, while the others
// include a sidebar navigation
const getLayout = ({ currentPathname }) => {
  const path = normalizePath(currentPathname);

  const fullWidthPaths = [PROFILE_PATHS.EDIT, PROFILE_PATHS.PROFILE_ROOT];

  // if the current path is in the list of full width paths, use that layout
  if (fullWidthPaths.includes(path)) {
    return LAYOUTS.FULL_WIDTH;
  }

  // fallback to the sidebar layout
  return LAYOUTS.SIDEBAR;
};

const ProfileWrapper = ({
  children,
  isLOA3,
  isInMVI,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
  showNameTag,
}) => {
  const location = useLocation();

  const routesForNav = getRoutesForNav();

  const layout = useMemo(
    () => {
      return getLayout({
        currentPathname: location.pathname,
      });
    },
    [location.pathname],
  );

  return (
    <>
      {showNameTag && (
        <NameTag
          totalDisabilityRating={totalDisabilityRating}
          totalDisabilityRatingServerError={totalDisabilityRatingServerError}
        />
      )}

      {layout === LAYOUTS.SIDEBAR && (
        <>
          <div className="medium-screen:vads-u-display--none">
            <ProfileMobileSubNav
              routes={routesForNav}
              isLOA3={isLOA3}
              isInMVI={isInMVI}
            />
          </div>

          <div className="vads-l-grid-container vads-u-padding-x--0">
            <ProfileBreadcrumbs
              className={`medium-screen:vads-u-padding-left--2 vads-u-padding-left--1 ${isLOA3 &&
                'vads-u-margin-top--neg2'} vads-u-margin-bottom--neg2`}
            />
            <div className="vads-l-row">
              <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--3 vads-u-padding-left--2">
                <ProfileSubNav
                  routes={routesForNav}
                  isLOA3={isLOA3}
                  isInMVI={isInMVI}
                />
              </div>
              <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
                {/* children will be passed in from React Router one level up */}
                {children}
                <ProfilePrivacyPolicy />
              </div>
            </div>
          </div>
        </>
      )}

      {layout === LAYOUTS.FULL_WIDTH && (
        <ProfileFullWidthContainer>
          <>
            {children}
            <ProfilePrivacyPolicy />
          </>
        </ProfileFullWidthContainer>
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
  hero: PropTypes.object,
  isInMVI: PropTypes.bool,
  isLOA3: PropTypes.bool,
  location: PropTypes.object,
  showNameTag: PropTypes.bool,
  totalDisabilityRating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  totalDisabilityRatingServerError: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfileWrapper);
