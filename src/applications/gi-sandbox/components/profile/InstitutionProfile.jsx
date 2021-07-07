/* eslint-disable jsx-a11y/anchor-has-content */
import PropTypes from 'prop-types';
import React from 'react';

import AccordionItem from '../AccordionItem';
import ProfilePageHeader from '../../containers/ProfilePageHeader';
import Programs from './Programs';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import SchoolLocations from './SchoolLocations';
import CautionaryInformation from './CautionaryInformation';
import AdditionalInformation from './AdditionalInformation';
import JumpLink from './JumpLink';
import ProfileSection from './ProfileSection';
import ContactInformation from './ContactInformation';
import EstimateYourBenefits from '../../containers/EstimateYourBenefits';
import { convertRatingToStars } from '../../utils/helpers';
import SchoolRatings from './SchoolRatings';
import { MINIMUM_RATING_COUNT } from '../../constants';

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

    const stars = convertRatingToStars(profile.attributes.ratingAverage);
    const displayStars =
      this.props.gibctSchoolRatings &&
      stars &&
      profile.attributes.ratingCount >= MINIMUM_RATING_COUNT;

    return (
      <div className="institution-profile">
        <div className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4">
          <div className="usa-width-three-fourths">
            <ProfilePageHeader institution={profile.attributes} />
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
            <JumpLink label="Veteran ratings" jumpToId="veteran-ratings" />
            <JumpLink
              label="Cautionary information"
              jumpToId="cautionary-information"
            />
            <JumpLink label="School locations" jumpToId="school-locations" />
            <JumpLink label="Academics" jumpToId="academics" />
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
        />
        <ProfileSection
          label="Getting started with benefits"
          id="getting-started-with-benefits"
        />
        <ProfileSection label="Veteran ratings" id="veteran-ratings" />
        <ProfileSection
          label="Cautionary information"
          id="cautionary-information"
        />
        <ProfileSection label="School locations" id="school-locations" />
        <ProfileSection label="Academics" id="academics" />
        <ProfileSection
          label="Veteran programs and support"
          id="veteran-programs-and-support"
        />
        <ProfileSection label="Contact information" id="contact-information" />

        <div className="usa-accordion vads-u-margin-top--4">
          <ul>
            <AccordionItem button="Estimate your benefits">
              <EstimateYourBenefits gibctEybBottomSheet={gibctEybBottomSheet} />
            </AccordionItem>
            {!isOJT && (
              <AccordionItem button="Veteran programs">
                <Programs
                  institution={profile.attributes}
                  onShowModal={showModal}
                />
              </AccordionItem>
            )}
            {this.shouldShowSchoolLocations(profile.attributes.facilityMap) && (
              <AccordionItem button="School locations">
                <SchoolLocations
                  institution={profile.attributes}
                  facilityMap={profile.attributes.facilityMap}
                  calculator={this.props.calculator}
                  eligibility={this.props.eligibility}
                  constants={constants}
                  version={this.props.version}
                  onViewLess={this.scrollToLocations}
                />
              </AccordionItem>
            )}
            <AccordionItem
              button="Cautionary information"
              ref={c => {
                this._cautionaryInfo = c;
              }}
            >
              <CautionaryInformation
                institution={profile.attributes}
                onShowModal={showModal}
              />
            </AccordionItem>
            {displayStars && (
              <AccordionItem button="School ratings">
                <div id="profile-school-ratings">
                  <SchoolRatings
                    ratingAverage={profile.attributes.ratingAverage}
                    ratingCount={profile.attributes.ratingCount}
                    institutionCategoryRatings={
                      profile.attributes.institutionCategoryRatings
                    }
                  />
                </div>
              </AccordionItem>
            )}
            <AccordionItem button="Contact details">
              <ContactInformation institution={profile.attributes} />
            </AccordionItem>
            <AccordionItem button="Additional information">
              <AdditionalInformation
                institution={profile.attributes}
                onShowModal={showModal}
                constants={constants}
              />
            </AccordionItem>
          </ul>
        </div>
      </div>
    );
  }
}

export default InstitutionProfile;
