import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useLocation } from 'react-router-dom';
import NameTag from '~/applications/personalization/components/NameTag';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { hasTotalDisabilityError } from '../../common/selectors/ratedDisabilities';
import ProfileSubNav from './ProfileSubNav';
import { PROFILE_PATHS } from '../constants';
import { ProfileFullWidthContainer } from './ProfileFullWidthContainer';
import { getRoutesForNav } from '../routesForNav';
import { normalizePath } from '../../common/helpers';
import { ProfileBreadcrumbs } from './ProfileBreadcrumbs';
import { ProfilePrivacyPolicy } from './ProfilePrivacyPolicy';
import ProfileMobileSubNav from './ProfileMobileSubNav';

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
  totalDisabilityRatingError,
  showNameTag,
}) => {
  const location = useLocation();

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profile2Toggle = useToggleValue(TOGGLE_NAMES.profile2Enabled);
  const profileHealthCareSettingsPage = useToggleValue(
    TOGGLE_NAMES.profileHealthCareSettingsPage,
  );

  const routesForNav = getRoutesForNav({
    profile2Enabled: profile2Toggle,
    profileHealthCareSettingsPage,
  });

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
          totalDisabilityRatingError={totalDisabilityRatingError}
        />
      )}

      {layout === LAYOUTS.SIDEBAR && (
        <>
          <div className="vads-u-padding-x--1 medium-screen:vads-u-display--none">
            {profile2Toggle ? (
              <>
                <ProfileBreadcrumbs />
                <ProfileSubNav
                  className="vads-u-margin-top--neg1 vads-u-margin-bottom--4"
                  routes={routesForNav}
                  isLOA3={isLOA3}
                  isInMVI={isInMVI}
                />
              </>
            ) : (
              <ProfileMobileSubNav
                routes={routesForNav}
                isLOA3={isLOA3}
                isInMVI={isInMVI}
              />
            )}
          </div>

          <div className="vads-l-grid-container vads-u-padding-x--0">
            <ProfileBreadcrumbs className="vads-u-display--none medium-screen:vads-u-display--block medium-screen:vads-u-padding-x--2" />
            <div className="vads-l-row">
              <div className="vads-u-display--none medium-screen:vads-u-display--block medium-screen:vads-u-padding-x--2 vads-l-col--3">
                {profile2Toggle ? (
                  <ProfileSubNav
                    routes={routesForNav}
                    isLOA3={isLOA3}
                    isInMVI={isInMVI}
                  />
                ) : (
                  <nav className="va-subnav" aria-labelledby="subnav-header">
                    <div>
                      <h2
                        id="subnav-header"
                        className="vads-u-font-size--h4 vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-y--2"
                      >
                        Profile <span className="sr-only">menu</span>
                      </h2>
                      <ProfileSubNav
                        routes={routesForNav}
                        isLOA3={isLOA3}
                        isInMVI={isInMVI}
                      />
                    </div>
                  </nav>
                )}
              </div>
              <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 small-desktop-screen:vads-l-col--9">
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
    totalDisabilityRatingError: hasTotalDisabilityError(state),
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
  totalDisabilityRatingError: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfileWrapper);
