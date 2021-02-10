import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import { fetchProfile, setPageTitle, showModal, hideModal } from '../actions';
import ServiceError from '../components/ServiceError';
import { useQueryParams } from '../utils/helpers';
import VetTecInstitutionProfile from '../components/vet-tec/InstitutionProfile';
import InstitutionProfile from '../components/profile/InstitutionProfile';

const { Element: ScrollElement, scroller } = Scroll;

export function ProfilePage({
  constants,
  profile,
  calculator,
  dispatchFetchProfile,
  dispatchSetPageTitle,
  dispatchShowModal,
  dispatchHideModal,
  eligibility,
  match,
}) {
  const { facilityCode, preSelectedProgram } = match.params;
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const institutionName = _.get(profile, 'attributes.name');

  useEffect(() => {
    return () => {
      dispatchHideModal();
    };
  }, []);

  useEffect(
    () => {
      if (institutionName) {
        dispatchSetPageTitle(`${institutionName} - GI Bill® Comparison Tool`);
      }
    },
    [institutionName],
  );

  useEffect(
    () => {
      scroller.scrollTo('profilePage', getScrollOptions());
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

  let content;

  if (profile.inProgress || _.isEmpty(profile.attributes)) {
    content = <LoadingIndicator message="Loading your profile..." />;
  } else {
    const isOJT = profile.attributes.type.toLowerCase() === 'ojt';

    if (profile.attributes.vetTecProvider) {
      content = (
        <VetTecInstitutionProfile
          institution={profile.attributes}
          showModal={dispatchShowModal}
          preSelectedProgram={preSelectedProgram}
          selectedProgram={calculator.selectedProgram}
        />
      );
    } else {
      content = (
        <InstitutionProfile
          profile={profile}
          isOJT={isOJT}
          constants={constants}
          showModal={dispatchShowModal}
          calculator={calculator}
          eligibility={eligibility}
          version={version}
        />
      );
    }
  }

  return (
    <ScrollElement
      name="profilePage"
      className="profile-page vads-u-padding-top--3"
    >
      {profile.error ? <ServiceError /> : content}
    </ScrollElement>
  );
}

const mapStateToProps = state => {
  const {
    constants: { constants },
    profile,
    calculator,
    eligibility,
  } = state;
  return {
    constants,
    profile,
    calculator,
    eligibility,
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
