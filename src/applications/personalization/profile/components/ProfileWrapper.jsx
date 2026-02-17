import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useLocation } from 'react-router-dom';
import NameTag from '~/applications/personalization/components/NameTag';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import { isSchedulingPreferencesPilotEligible as isSchedulingPreferencesPilotEligibleSelector } from '~/platform/user/selectors';
import { hasTotalDisabilityError } from '../../common/selectors/ratedDisabilities';
import ProfileSubNav from './ProfileSubNav';
import { PROFILE_PATHS } from '../constants';
import { ProfileFullWidthContainer } from './ProfileFullWidthContainer';
import { getRoutesForNav } from '../routesForNav';
import { normalizePath } from '../../common/helpers';
import { ProfileBreadcrumbs } from './ProfileBreadcrumbs';
import { ProfilePrivacyPolicy } from './ProfilePrivacyPolicy';
import ProfileMobileSubNav from './ProfileMobileSubNav';
import { selectProfileToggles } from '../selectors';

const LAYOUTS = {
  SIDEBAR: 'sidebar',
  FULL_WIDTH: 'full-width',
  FULL_WIDTH_AND_BREADCRUMBS: 'full-width-and-breadcrumbs',
};

// we want to use a different layout for the specific routes
// the profile hub and edit page are full width, while the others
// include a sidebar navigation
const getLayout = ({ currentPathname }) => {
  const path = normalizePath(currentPathname);

  const fullWidthAndBreadcrumbsPaths = [PROFILE_PATHS.PROFILE_ROOT];

  const fullWidthPaths = [
    PROFILE_PATHS.EDIT,
    PROFILE_PATHS.SCHEDULING_PREF_CONTACT_METHOD,
    PROFILE_PATHS.SCHEDULING_PREF_CONTACT_TIMES,
    PROFILE_PATHS.SCHEDULING_PREF_APPOINTMENT_TIMES,
  ];

  if (fullWidthAndBreadcrumbsPaths.includes(path)) {
    return LAYOUTS.FULL_WIDTH_AND_BREADCRUMBS;
  }

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
  isSchedulingPreferencesPilotEligible,
  profile2Enabled,
  totalDisabilityRating,
  totalDisabilityRatingError,
  showNameTag,
}) => {
  const location = useLocation();

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profileHealthCareSettingsPage = useToggleValue(
    TOGGLE_NAMES.profileHealthCareSettingsPage,
  );
  const profileHideHealthCareContacts = useToggleValue(
    TOGGLE_NAMES.profileHideHealthCareContacts,
  );

  const routesForNav = getRoutesForNav({
    profile2Enabled,
    profileHealthCareSettingsPage,
    profileHideHealthCareContacts,
  });

  const layout = useMemo(() => {
    return getLayout({
      currentPathname: location.pathname,
    });
  }, [location.pathname]);

  const content = (
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
            {profile2Enabled ? (
              <>
                <ProfileBreadcrumbs routes={routesForNav} />
                <ProfileSubNav
                  className="vads-u-margin-top--neg1 vads-u-margin-bottom--4"
                  routes={routesForNav}
                  isLOA3={isLOA3}
                  isInMVI={isInMVI}
                  isSchedulingPreferencesPilotEligible={
                    isSchedulingPreferencesPilotEligible
                  }
                />
              </>
            ) : (
              <ProfileMobileSubNav
                routes={routesForNav}
                isLOA3={isLOA3}
                isInMVI={isInMVI}
                isSchedulingPreferencesPilotEligible={
                  isSchedulingPreferencesPilotEligible
                }
              />
            )}
          </div>

          <div className="vads-l-grid-container vads-u-padding-x--0">
            <ProfileBreadcrumbs
              routes={routesForNav}
              className={`medium-screen:vads-u-padding-left--2 vads-u-padding-left--1 ${
                isLOA3 && !profile2Enabled && 'vads-u-margin-top--neg2'
              } ${
                isLOA3 &&
                profile2Enabled &&
                'vads-u-display--none medium-screen:vads-u-display--block'
              }`}
            />
            <div className="vads-l-row">
              <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--3 vads-u-padding-left--2">
                {profile2Enabled ? (
                  <ProfileSubNav
                    routes={routesForNav}
                    isLOA3={isLOA3}
                    isInMVI={isInMVI}
                    isSchedulingPreferencesPilotEligible={
                      isSchedulingPreferencesPilotEligible
                    }
                    className="vads-u-margin-bottom--5"
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
                        isSchedulingPreferencesPilotEligible={
                          isSchedulingPreferencesPilotEligible
                        }
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
        <ProfileFullWidthContainer
          profile2Enabled={profile2Enabled}
          breadcrumbs={false}
        >
          <>
            {children}
            <ProfilePrivacyPolicy />
          </>
        </ProfileFullWidthContainer>
      )}

      {layout === LAYOUTS.FULL_WIDTH_AND_BREADCRUMBS && (
        <ProfileFullWidthContainer
          profile2Enabled={profile2Enabled}
          breadcrumbs
        >
          <>
            {children}
            <ProfilePrivacyPolicy />
          </>
        </ProfileFullWidthContainer>
      )}
    </>
  );

  // Wrap all Profile content with InitializeVAPServiceID for LOA3 users in MVI.
  // This ensures VA Profile ID is created before any Profile pages are accessed.
  // NOTE: Child components (e.g., NotificationSettings, DirectDeposit, PaperlessDelivery)
  // should NOT wrap themselves in InitializeVAPServiceID, as initialization is now handled here.
  if (isLOA3 && isInMVI) {
    return <InitializeVAPServiceID>{content}</InitializeVAPServiceID>;
  }

  return content;
};

const mapStateToProps = (state, ownProps) => {
  const hero = state.vaProfile?.hero;
  const profileToggles = selectProfileToggles(state);
  const profile2Enabled = profileToggles?.profile2Enabled;
  const isSchedulingPreferencesPilotEligible =
    isSchedulingPreferencesPilotEligibleSelector(state);
  return {
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingError: hasTotalDisabilityError(state),
    showNameTag: ownProps.isLOA3 && isEmpty(hero?.errors) && !profile2Enabled,
    profile2Enabled,
    isSchedulingPreferencesPilotEligible,
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
  isSchedulingPreferencesPilotEligible: PropTypes.bool,
  location: PropTypes.object,
  profile2Enabled: PropTypes.bool,
  showNameTag: PropTypes.bool,
  totalDisabilityRating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  totalDisabilityRatingError: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfileWrapper);
