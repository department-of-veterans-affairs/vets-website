/* eslint-disable jsx-a11y/anchor-has-content */
import PropTypes from 'prop-types';
import React from 'react';

import AccordionItem from '../AccordionItem';
import If from '../If';
import HeadingSummary from './HeadingSummary';
import Programs from './Programs';
import SchoolLocations from './SchoolLocations';
import Outcomes from './Outcomes';
import Calculator from './Calculator';
import CautionaryInformation from './CautionaryInformation';
import AdditionalInformation from './AdditionalInformation';

export class InstitutionProfile extends React.Component {
  render() {
    const { profile, isOJT, constants, outcomes } = this.props;
    return (
      <div>
        <HeadingSummary
          institution={profile.attributes}
          onLearnMore={this.props.showModal.bind(this, 'gibillstudents')}
          onViewWarnings={this.handleViewWarnings}
        />
        <div className="usa-accordion">
          <ul>
            <AccordionItem button="Estimate your benefits">
              <Calculator />
            </AccordionItem>
            {!isOJT && (
              <AccordionItem button="Veteran programs">
                <Programs
                  institution={profile.attributes}
                  onShowModal={this.props.showModal}
                />
              </AccordionItem>
            )}
            {!isOJT && (
              <AccordionItem button="Student outcomes">
                <If
                  condition={!!profile.attributes.facilityCode && !!constants}
                  comment="TODO"
                >
                  <Outcomes
                    graphing={outcomes}
                    onShowModal={this.props.showModal}
                  />
                </If>
              </AccordionItem>
            )}
            <AccordionItem button="School locations">
              <SchoolLocations />
            </AccordionItem>
            />
            <AccordionItem
              button="Cautionary information"
              ref={c => {
                this._cautionaryInfo = c;
              }}
            >
              <a name="viewWarnings" />
              <CautionaryInformation
                institution={profile.attributes}
                onShowModal={this.props.showModal}
              />
            </AccordionItem>
            <AccordionItem button="Additional information">
              <AdditionalInformation
                institution={profile.attributes}
                onShowModal={this.props.showModal}
                constants={this.props.constants}
              />
            </AccordionItem>
          </ul>
        </div>
      </div>
    );
  }
}

InstitutionProfile.propTypes = {
  profile: PropTypes.object,
  isOJT: PropTypes.bool,
  constants: PropTypes.object,
  outcomes: PropTypes.object,
};

export default InstitutionProfile;
