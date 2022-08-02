import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  fullNameLoadError,
  personalInformationLoadError,
} from '@@profile/selectors';

import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import NameTag from '~/applications/personalization/components/NameTag';
import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';

const NotAllDataAvailableError = () => (
  <div
    data-testid="not-all-data-available-error"
    className="vads-u-margin-bottom--4"
  >
    <va-alert status="warning" visible>
      <h2 slot="headline">We can’t load all the information in your profile</h2>
      <p>
        We’re sorry. Something went wrong on our end. We can’t display all the
        information in your profile. Please refresh the page or try again later.
      </p>
    </va-alert>
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
  showNameTag,
}) => {
  return (
    <>
      {showNameTag && (
        <NameTag
          totalDisabilityRating={totalDisabilityRating}
          totalDisabilityRatingServerError={totalDisabilityRatingServerError}
        />
      )}

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
  const hero = state.vaProfile?.hero;

  return {
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
    showNameTag: ownProps.isLOA3 && isEmpty(hero?.errors),
    showNotAllDataAvailableError:
      !!fullNameLoadError(state) || !!personalInformationLoadError(state),
  };
};

ProfileWrapper.propTypes = {
  children: PropTypes.node.isRequired,
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
  hero: PropTypes.object,
  isInMVI: PropTypes.bool,
  isLOA3: PropTypes.bool,
  location: PropTypes.object,
  showNameTag: PropTypes.bool,
  totalDisabilityRating: PropTypes.string,
  totalDisabilityRatingServerError: PropTypes.bool,
};

export default connect(mapStateToProps)(ProfileWrapper);
