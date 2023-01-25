import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
// import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { fetchProfile, setPageTitle, showModal, hideModal } from '../actions';
import VetTecInstitutionProfile from '../components/vet-tec/InstitutionProfile';
import InstitutionProfile from '../components/profile/InstitutionProfile';
import ServiceError from '../components/ServiceError';
import { isSmallScreen, useQueryParams } from '../utils/helpers';
// used for mock data, will delete when API is ready | comment out when pushing to github, uncomment to use
// import { institutionRatingsMockData } from '../components/profile/schoolRatings/IPMockData';

const { Element: ScrollElement } = Scroll;

export function ProfilePage({
  constants,
  profile,
  calculator,
  dispatchFetchProfile,
  dispatchShowModal,
  dispatchHideModal,
  eligibility,
  gibctEybBottomSheet,
  gibctSchoolRatings,
  match,
  compare,
}) {
  const { facilityCode } = match.params;
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const institutionName = _.get(profile, 'attributes.name');
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());

  useEffect(() => {
    const checkSize = () => {
      setSmallScreen(isSmallScreen());
    };
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
      dispatchHideModal();
    };
  }, []);

  useEffect(
    () => {
      if (institutionName) {
        document.title = `${institutionName}: GI Bill® Comparison Tool | Veterans Affairs`;
      }
    },
    [institutionName],
  );

  useEffect(
    () => {
      scrollTo('profilePage', getScrollOptions());
      focusElement('.profile-page h1');
    },
    [profile.inProgress],
  );

  useEffect(
    () => {
      dispatchFetchProfile(facilityCode, version);
    },
    [version],
  );

  /// //////////////////////////////////////////////////////////////////////////////////////
  /*
    USE BELOW USEEFFECT FOR TESTING UNTIL API IS READY | uncomment to use. Must comment out code before pushing to github
  */
  // useEffect(() =>{
  //   const addRatingsToProfile =()=>{

  //       profile.attributes.ratingAverage = institutionRatingsMockData[0]['overall_avg']
  //       profile.attributes.ratingCount = institutionRatingsMockData[0]['institution_rating_count']
  //       // profile.attributes.ratingAverage = 4
  //       // profile.attributes.ratingCount = 6
  //   }
  //   addRatingsToProfile()

  // },[profile])
  /// //////////////////////////////////////////////////////////////////////////////////////

  let content;

  const loadingProfile = profile.inProgress || _.isEmpty(profile.attributes);
  if (loadingProfile) {
    content = <LoadingIndicator message="Loading your profile..." />;
  } else {
    const isOJT = profile.attributes.type.toLowerCase() === 'ojt';

    if (profile.attributes.vetTecProvider) {
      content = (
        <VetTecInstitutionProfile
          institution={profile.attributes}
          showModal={dispatchShowModal}
          selectedProgram={calculator.selectedProgram}
          compare={compare}
          smallScreen={smallScreen}
        />
      );
    } else {
      content = (
        <InstitutionProfile
          institution={profile.attributes}
          isOJT={isOJT}
          constants={constants}
          showModal={dispatchShowModal}
          calculator={calculator}
          eligibility={eligibility}
          version={version}
          gibctEybBottomSheet={gibctEybBottomSheet}
          gibctSchoolRatings={gibctSchoolRatings}
          compare={compare}
          smallScreen={smallScreen}
        />
      );
    }
  }

  return (
    <ScrollElement
      name="profilePage"
      className="profile-page vads-u-padding-top--3"
    >
      <div className="row">
        {profile.error && <ServiceError />}
        {!profile.error && content}
      </div>
    </ScrollElement>
  );
}

const mapStateToProps = state => {
  const {
    constants: { constants },
    profile,
    calculator,
    eligibility,
    compare,
  } = state;
  return {
    compare,
    constants,
    profile,
    calculator,
    eligibility,
    // gibctEybBottomSheet: toggleValues(state).true,
    // //[
    //   //true
    //   // FEATURE_FLAG_NAMES.gibctEybBottomSheet
    // //],
    // gibctSchoolRatings: toggleValues(state).true
    // //[
    //   //true
    //   // FEATURE_FLAG_NAMES.gibctSchoolRatings
    // //],
  };
};

const mapDispatchToProps = {
  dispatchFetchProfile: fetchProfile,
  dispatchSetPageTitle: setPageTitle,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePage);
