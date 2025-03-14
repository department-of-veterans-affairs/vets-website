/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import ProfilePageHeader from '../../containers/ProfilePageHeader';
import SchoolLocations from './SchoolLocations';
import CautionaryInformation from './CautionaryInformation';
import JumpLink from './JumpLink';
import ProfileSection from './ProfileSection';
import ContactInformation from './ContactInformation';
import CalculateYourBenefits from '../../containers/CalculateYourBenefits';
import {
  convertRatingToStars,
  showSchoolContentBasedOnType,
} from '../../utils/helpers';
import SchoolRatings from './schoolRatings/SchoolRatings';
import { MINIMUM_RATING_COUNT } from '../../constants';
import GettingStartedWithBenefits from './GettingStartedWithBenefits';
import Academics from './Academics';
import VeteranProgramsAndSupport from './VeteranProgramsAndSupport';
import BackToTop from '../BackToTop';
import CautionaryInformationLearMore from '../CautionaryInformationLearMore';
import YellowRibbonSelector from './YellowRibbonSelector';
import Programs from './Programs';
import NewFeatureProgramsYRTAlert from './NewFeatureProgramsYRTAlert';

export default function InstitutionProfile({
  institution,
  isOJT,
  constants,
  showModal,
  calculator,
  eligibility,
  version,
  gibctEybBottomSheet,
  compare,
  smallScreen,
}) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.showYellowRibbonTable);
  const toggleGiProgramsFlag = useToggleValue(
    TOGGLE_NAMES.giComparisonToolProgramsToggleFlag,
  );
  const [visibleAlert, setVisibleAlert] = useState(true);
  const shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);
  const { type, facilityCode, name, programTypes } = institution;
  localStorage.setItem('institutionName', name);
  const scrollToLocations = () => {
    scrollTo('school-locations', getScrollOptions());
  };
  // environment variable to keep ratings out of production until ready
  const isShowRatingsToggle = useToggleValue(
    TOGGLE_NAMES.giComparisonToolShowRatings,
  );

  let stars = false;
  let ratingCount = 0;
  let institutionRatingIsNotNull = false;
  let institutionCountIsNotNull = false;
  let institutionOverallAvgIsNotNull = false;
  /** ***CHECK IF INSTITUTION.INSTITUTIONRATING IS NULL**** */
  if (institution.institutionRating != null) {
    institutionRatingIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institution.institutionRating.institutionRatingCount != null
  ) {
    institutionCountIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institutionCountIsNotNull &&
    institution.institutionRating.overallAvg != null
  ) {
    institutionOverallAvgIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institutionCountIsNotNull &&
    institutionOverallAvgIsNotNull
  ) {
    stars = convertRatingToStars(institution.institutionRating.overallAvg);
    ratingCount = institution.institutionRating.institutionRatingCount;
  }
  /** ************************************************************************ */
  const displayStars =
    isShowRatingsToggle && stars && ratingCount >= MINIMUM_RATING_COUNT;

  const institutionProfileId = 'institution-profile';
  const profilePageHeaderId = 'profile-page-header';

  return (
    <div id={institutionProfileId} className="institution-profile">
      <div
        id={profilePageHeaderId}
        className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4"
      >
        <div className="usa-width-three-fourths">
          <ProfilePageHeader
            institution={institution}
            isShowRatingsToggle={isShowRatingsToggle}
          />
          {type === 'FLIGHT' && (
            <p>
              For information about VA flight benefits, visit{' '}
              <VaLink
                text="here."
                href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/flight-training/"
              />
              <span className="vads-u-display--inline-block">
                Please contact a School Certifying Official listed under the
                Contact information at the bottom of this page to discuss
                benefits available.
              </span>
            </p>
          )}
        </div>

        <div className="usa-width-one-fourth">
          <h2 className="vads-u-padding-top--2 small-screen-header">
            On this page
          </h2>
          {showSchoolContentBasedOnType(type) &&
            type !== 'FOREIGN' && (
              <JumpLink
                label="Calculate your benefits"
                jumpToId="calculate-your-benefits"
              />
            )}
          {institution.yr === true &&
            toggleValue && (
              <JumpLink
                label="Yellow Ribbon Program information"
                jumpToId="yellow-ribbon-program-information"
              />
            )}
          <JumpLink
            label="Getting started with benefits"
            jumpToId="getting-started-with-benefits"
          />
          {displayStars &&
            isShowRatingsToggle && (
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
          {programTypes?.length > 0 &&
            toggleGiProgramsFlag && (
              <JumpLink label="Programs" jumpToId="programs" />
            )}
          {!isOJT && (
            <JumpLink
              label="Veteran programs and support"
              jumpToId="veteran-programs-and-support"
            />
          )}
          <JumpLink
            label="Contact information"
            jumpToId="contact-information"
          />
        </div>
      </div>
      {((institution.yr === true && toggleValue && programTypes?.length > 0) ||
        (programTypes?.length > 0 && toggleGiProgramsFlag)) && (
        <NewFeatureProgramsYRTAlert
          institution={institution}
          toggleValue={toggleValue}
          toggleGiProgramsFlag={toggleGiProgramsFlag}
          programTypes={programTypes}
          visible={visibleAlert}
          onClose={() => setVisibleAlert(false)}
        />
      )}
      {showSchoolContentBasedOnType(type) &&
        type !== 'FOREIGN' && (
          <ProfileSection
            label="Calculate your benefits"
            id="calculate-your-benefits"
          >
            <CalculateYourBenefits
              gibctEybBottomSheet={gibctEybBottomSheet}
              isOJT={isOJT}
            />
          </ProfileSection>
        )}

      {type === 'FOREIGN' && (
        <p>
          Limited programs are approved at foreign schools, please contact
          <a
            href="mailto:federal.approvals@va.gov"
            className="vads-u-margin-x--0p5"
          >
            federal.approvals@va.gov
          </a>
          to verify if your intended program is approved at this foreign
          location.
        </p>
      )}
      {institution.yr === true &&
        toggleValue && (
          <ProfileSection
            label="Yellow Ribbon Program information"
            id="yellow-ribbon-program-information"
          >
            <p data-testid="yellow-ribbon-section">
              The Yellow Ribbon Program can help reduce your out-of-pocket
              tuition and fee costs at participating colleges and universities.
              By enrolling, you'll benefit from a contribution made by the
              school. VA will match this contribution
              {type === 'FOREIGN' && `${` `}in United States Dollars (USD)`},
              covering up to the full cost of tuition and fees.
            </p>
            <p>
              <strong>
                If applicable, contact the individual school to confirm the
                number of students eligible for funding.
              </strong>
            </p>

            <va-link
              href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/"
              text="Find out if you qualify for the Yellow Ribbon Program"
              className="vads-u-margin-bottom--2"
              data-testid="yellow-ribbon-program-link"
            />
            {institution.yellowRibbonPrograms.length > 0 ? (
              <YellowRibbonSelector
                programs={institution.yellowRibbonPrograms}
              />
            ) : (
              <p className="vads-u-font-weight--bold vads-u-padding-top--3">
                No programs to display
              </p>
            )}
          </ProfileSection>
        )}
      <ProfileSection
        label="Getting started with benefits"
        id="getting-started-with-benefits"
      >
        <GettingStartedWithBenefits />
      </ProfileSection>
      {displayStars &&
        isShowRatingsToggle && (
          <ProfileSection label="Veteran ratings" id="veteran-ratings">
            <div>
              <SchoolRatings
                ratingAverage={institution.institutionRating.overallAvg}
                ratingCount={
                  institution.institutionRating.institutionRatingCount
                }
                institutionCategoryRatings={institution.institutionRating}
              />
            </div>
          </ProfileSection>
        )}

      <ProfileSection
        label="Cautionary information"
        id="cautionary-information"
      >
        <CautionaryInformationLearMore />
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
      {toggleGiProgramsFlag &&
        programTypes.length > 0 && (
          <ProfileSection label="Programs" id="programs">
            <Programs programTypes={programTypes} facilityCode={facilityCode} />
          </ProfileSection>
        )}
      {!isOJT && (
        <ProfileSection label="Academics" id="academics">
          <Academics institution={institution} onShowModal={showModal} />
        </ProfileSection>
      )}
      {!isOJT && (
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
      )}
      <ProfileSection label="Contact information" id="contact-information">
        <ContactInformation institution={institution} showModal={showModal} />
      </ProfileSection>
      <BackToTop
        parentId={institutionProfileId}
        profilePageHeaderId={profilePageHeaderId}
        compare={compare}
        smallScreen={smallScreen}
      />
    </div>
  );
}
InstitutionProfile.propTypes = {
  calculator: PropTypes.object,
  compare: PropTypes.object,
  constants: PropTypes.object,
  eligibility: PropTypes.object,
  gibctEybBottomSheet: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  institution: PropTypes.object,
  isOJT: PropTypes.bool,
  showModal: PropTypes.func,
  smallScreen: PropTypes.bool,
  version: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};
