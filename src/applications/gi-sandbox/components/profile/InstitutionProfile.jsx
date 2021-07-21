/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';

import ProfilePageHeader from '../../containers/ProfilePageHeader';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import SchoolLocations from './SchoolLocations';
import CautionaryInformation from './CautionaryInformation';
import JumpLink from './JumpLink';
import ProfileSection from './ProfileSection';
import ContactInformation from './ContactInformation';
import CalculateYourBenefits from '../../containers/CalculateYourBenefits';
import { convertRatingToStars } from '../../utils/helpers';
import SchoolRatings from './SchoolRatings';
import { MINIMUM_RATING_COUNT } from '../../constants';
import GettingStartedWithBenefits from '../profile/GettingStartedWithBenefits';
import Academics from './Academics';
import VeteranProgramsAndSupport from './VeteranProgramsAndSupport';
import BackToTop from '../BackToTop';

export default function InstitutionProfile({
  profile,
  isOJT,
  constants,
  showModal,
  calculator,
  eligibility,
  version,
  gibctSchoolRatings,
  gibctEybBottomSheet,
  compare,
}) {
  const shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  const scrollToLocations = () => {
    scroller.scrollTo('school-locations', getScrollOptions());
  };

  const institution = profile.attributes;

  const stars = convertRatingToStars(institution.ratingAverage);
  const displayStars =
    gibctSchoolRatings &&
    stars &&
    institution.ratingCount >= MINIMUM_RATING_COUNT;

  const institutionProfileId = 'institution-profile';
  const profilePageHeaderId = 'profile-page-header';

  return (
    <div id={institutionProfileId} className="institution-profile">
      <div
        id={profilePageHeaderId}
        className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4"
      >
        <div className="usa-width-three-fourths">
          <ProfilePageHeader institution={institution} />
        </div>

        <div className="usa-width-one-fourth">
          <h2 className="vads-u-padding-top--2">On this page</h2>
          <JumpLink
            label="Calculate your benefits"
            jumpToId="calculate-your-benefits"
          />
          <JumpLink
            label="Getting started with benefits"
            jumpToId="getting-started-with-benefits"
          />
          {displayStars && (
            <JumpLink label="Veteran ratings" jumpToId="veteran-ratings" />
          )}
          <JumpLink
            label="Cautionary information"
            jumpToId="cautionary-information"
          />
          {shouldShowSchoolLocations(institution.facilityMap) && (
            <JumpLink label="School locations" jumpToId="school-locations" />
          )}
          {!isOJT && <JumpLink label="Academics" jumpToId="academics" />}
          <JumpLink
            label="Veteran programs and support"
            jumpToId="veteran-programs-and-support"
          />
          <JumpLink
            label="Contact information"
            jumpToId="contact-information"
          />
        </div>
      </div>

      <ProfileSection
        label="Calculate your benefits"
        id="calculate-your-benefits"
      >
        <CalculateYourBenefits gibctEybBottomSheet={gibctEybBottomSheet} />
      </ProfileSection>
      <ProfileSection
        label="Getting started with benefits"
        id="getting-started-with-benefits"
      >
        <GettingStartedWithBenefits />
      </ProfileSection>
      {displayStars && (
        <ProfileSection label="Veteran ratings" id="veteran-ratings">
          <div id="profile-school-ratings">
            <SchoolRatings
              ratingAverage={institution.ratingAverage}
              ratingCount={institution.ratingCount}
              institutionCategoryRatings={
                institution.institutionCategoryRatings
              }
            />
          </div>
        </ProfileSection>
      )}
      <ProfileSection
        label="Cautionary information"
        id="cautionary-information"
      >
        <CautionaryInformation
          institution={institution}
          showModal={showModal}
        />
      </ProfileSection>
      {shouldShowSchoolLocations(institution.facilityMap) && (
        <ProfileSection label="School locations" id="school-locations">
          <SchoolLocations
            institution={institution}
            facilityMap={institution.facilityMap}
            calculator={calculator}
            eligibility={eligibility}
            constants={constants}
            version={version}
            onViewLess={scrollToLocations}
          />
        </ProfileSection>
      )}
      {!isOJT && (
        <ProfileSection label="Academics" id="academics">
          <Academics institution={institution} onShowModal={showModal} />
        </ProfileSection>
      )}
      <ProfileSection
        label="Veteran programs and support"
        id="veteran-programs-and-support"
      >
        <VeteranProgramsAndSupport
          institution={institution}
          constants={constants}
          showModal={showModal}
        />
      </ProfileSection>
      <ProfileSection label="Contact information" id="contact-information">
        <ContactInformation institution={institution} showModal={showModal} />
      </ProfileSection>
      <BackToTop
        parentId={institutionProfileId}
        profilePageHeaderId={profilePageHeaderId}
        compare={compare}
      />
    </div>
  );
}
