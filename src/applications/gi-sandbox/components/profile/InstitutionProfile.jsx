/* eslint-disable jsx-a11y/anchor-has-content */
import PropTypes from 'prop-types';
import React from 'react';

import ProfilePageHeader from '../../containers/ProfilePageHeader';
import Programs from './Programs';
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
import VeteranProgramsAndSupport from './VeteranProgramsAndSupport';

export class InstitutionProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    isOJT: PropTypes.bool,
    constants: PropTypes.object,
    calculator: PropTypes.object,
    eligibility: PropTypes.object,
    gibctEybBottemSheet: PropTypes.bool,
  };

  shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  scrollToLocations = () => {
    scroller.scrollTo('school-locations', getScrollOptions());
  };

  render() {
    const {
      profile,
      isOJT,
      constants,
      showModal,
      gibctEybBottomSheet,
    } = this.props;
    const institution = profile.attributes;

    const stars = convertRatingToStars(institution.ratingAverage);
    const displayStars =
      this.props.gibctSchoolRatings &&
      stars &&
      institution.ratingCount >= MINIMUM_RATING_COUNT;

    return (
      <div className="institution-profile">
        <div className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4">
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
            {this.shouldShowSchoolLocations(institution.facilityMap) && (
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
        />
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
            onShowModal={showModal}
          />
        </ProfileSection>
        {this.shouldShowSchoolLocations(institution.facilityMap) && (
          <ProfileSection label="School locations" id="school-locations">
            <SchoolLocations
              institution={institution}
              facilityMap={institution.facilityMap}
              calculator={this.props.calculator}
              eligibility={this.props.eligibility}
              constants={constants}
              version={this.props.version}
              onViewLess={this.scrollToLocations}
            />
          </ProfileSection>
        )}
        {!isOJT && (
          <ProfileSection label="Academics" id="academics">
            <Programs institution={institution} onShowModal={showModal} />
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
          <ContactInformation institution={institution} />
        </ProfileSection>
      </div>
    );
  }
}

export default InstitutionProfile;
