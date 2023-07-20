import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useLocation } from 'react-router-dom';
import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import NameTag from '~/applications/personalization/components/NameTag';
import ProfileSubNav from './ProfileSubNav';
import ProfileMobileSubNav from './ProfileMobileSubNav';
import { PROFILE_PATHS } from '../constants';
import { EditContainer } from './edit/EditContainer';
import { routesForNav } from '../routesForNav';

// default layout includes the subnavs
// edit layout is a full-width layout
const LAYOUTS = {
  DEFAULT: 'default',
  EDIT: 'edit',
};

// we want to use a different layout for the edit page
// since the profile wrapper is getting passed in the router as children
// we can really scope a layout to just the edit page in a more 'react router' way
const getLayout = currentPathname => {
  return currentPathname === PROFILE_PATHS.EDIT
    ? LAYOUTS.EDIT
    : LAYOUTS.DEFAULT;
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
  const layout = getLayout(location.pathname);

  return (
    <>
      {showNameTag && (
        <NameTag
          totalDisabilityRating={totalDisabilityRating}
          totalDisabilityRatingServerError={totalDisabilityRatingServerError}
        />
      )}

      {layout === LAYOUTS.DEFAULT && (
        <>
          <div className="medium-screen:vads-u-display--none">
            <ProfileMobileSubNav
              routes={routesForNav}
              isLOA3={isLOA3}
              isInMVI={isInMVI}
            />
          </div>

          <div className="vads-l-grid-container vads-u-padding-x--0">
            <div className="vads-l-row">
              <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--3 vads-u-padding-left--2">
                <ProfileSubNav
                  routes={routesForNav}
                  isLOA3={isLOA3}
                  isInMVI={isInMVI}
                />
              </div>
              <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8 medium-screen:vads-u-min-height--viewport">
                {/* children will be passed in from React Router one level up */}
                {children}
              </div>
            </div>
          </div>
        </>
      )}

      {layout === LAYOUTS.EDIT && <EditContainer>{children}</EditContainer>}
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
