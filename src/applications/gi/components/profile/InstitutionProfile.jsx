/* eslint-disable jsx-a11y/anchor-has-content */
import PropTypes from 'prop-types';
import React from 'react';

import AccordionItem from '../AccordionItem';
import HeadingSummary from './HeadingSummary';
import Programs from './Programs';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import SchoolLocations from './SchoolLocations';
import Calculator from './Calculator';
import CautionaryInformation from './CautionaryInformation';
import AdditionalInformation from './AdditionalInformation';
import ContactInformation from './ContactInformation';
import EstimateYourBenefits from '../../containers/EstimateYourBenefits';

export class InstitutionProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    isOJT: PropTypes.bool,
    constants: PropTypes.object,
    calculator: PropTypes.object,
    eligibility: PropTypes.object,
    gibctEybBottemSheet: PropTypes.bool,
    gibctCh33BenefitRateUpdate: PropTypes.bool,
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
      gibctEstimateYourBenefits,
      gibctEybBottomSheet,
      gibctCh33BenefitRateUpdate,
    } = this.props;
    return (
      <div>
        <HeadingSummary
          institution={profile.attributes}
          onLearnMore={showModal.bind(this, 'gibillstudents')}
          onViewWarnings={this.handleViewWarnings}
        />
        <div className="usa-accordion vads-u-margin-top--4">
          <ul>
            <AccordionItem button="Estimate your benefits">
              {gibctEstimateYourBenefits ? (
                <EstimateYourBenefits
                  gibctEybBottomSheet={gibctEybBottomSheet}
                  gibctCh33BenefitRateUpdate={gibctCh33BenefitRateUpdate}
                />
              ) : (
                <Calculator />
              )}
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
