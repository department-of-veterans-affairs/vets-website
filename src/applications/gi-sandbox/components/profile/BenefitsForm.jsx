import React from 'react';
import PropTypes from 'prop-types';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import LearnMoreLabel from '../LearnMoreLabel';

export class BenefitsForm extends React.Component {
  state = { showYourMilitaryDetails: false };

  static propTypes = {
    showModal: PropTypes.func,
    hideModal: PropTypes.func,
    eligibilityChange: PropTypes.func,
    showHeader: PropTypes.bool,
    handleInputFocus: PropTypes.func,
    giBillChapterOpen: PropTypes.arrayOf(PropTypes.bool),
    yourMilitaryDetails: PropTypes.bool,
  };

  static defaultProps = {
    showGbBenefit: false,
    showHeader: false,
    giBillChapterOpen: [],
    yourMilitaryDetails: true,
  };

  cumulativeServiceOptions = () => [
    { optionValue: '1.0', optionLabel: '36+ months: 100%' }, // notice not 1.00
    { optionValue: '0.9', optionLabel: '30 months: 90%' },
    { optionValue: '0.8', optionLabel: '24 months: 80%' },
    { optionValue: '0.7', optionLabel: '18 months: 70%' },
    { optionValue: '0.6', optionLabel: '6 months: 60%' },
    { optionValue: '0.5', optionLabel: '90 days: 50%' },
    { optionValue: '1.00', optionLabel: 'GYSGT Fry Scholarship: 100%' }, // notice not 1.0
    {
      optionValue: 'service discharge',
      optionLabel: 'Service-Connected Discharge: 100%',
    },
    { optionValue: 'purple heart', optionLabel: 'Purple Heart Service: 100%' },
  ];

  renderLearnMoreLabel = ({ text, modal, ariaLabel, labelFor }) => (
    <LearnMoreLabel
      text={text}
      onClick={() => this.props.showModal(modal)}
      ariaLabel={ariaLabel}
      labelFor={labelFor || modal}
    />
  );

  handleMilitaryDetailsClick = () => {
    this.setState({
      showYourMilitaryDetails: !this.state.showYourMilitaryDetails,
    });
  };

  renderYourMilitaryDetails() {
    return (
      <div>
        <ExpandingGroup open={this.props.militaryStatus === 'spouse'}>
          <Dropdown
            label="What's your military status?"
            name="militaryStatus"
            options={[
              { optionValue: 'veteran', optionLabel: 'Veteran' },
              { optionValue: 'active duty', optionLabel: 'Active Duty' },
              {
                optionValue: 'national guard / reserves',
                optionLabel: 'National Guard / Reserves',
              },
              { optionValue: 'spouse', optionLabel: 'Spouse' },
              { optionValue: 'child', optionLabel: 'Child' },
            ]}
            value={this.props.militaryStatus}
            alt="What's your military status?"
            visible
            onChange={this.props.eligibilityChange}
            onFocus={this.props.handleInputFocus}
          />
          <Dropdown
            label="Is your spouse currently on active duty?"
            name="spouseActiveDuty"
            options={[
              { optionValue: 'yes', optionLabel: 'Yes' },
              { optionValue: 'no', optionLabel: 'No' },
            ]}
            value={this.props.spouseActiveDuty}
            alt="Is your spouse on active duty?"
            visible
            onChange={this.props.eligibilityChange}
            onFocus={this.props.handleInputFocus}
          />
        </ExpandingGroup>
        <ExpandingGroup
          open={
            ['30', '31', '33'].includes(this.props.giBillChapter) ||
            this.props.giBillChapterOpen.includes(true)
          }
        >
          <Dropdown
            label={this.renderLearnMoreLabel({
              text: 'Which GI Bill benefit do you want to use?',
              modal: 'giBillChapter',
              ariaLabel: ariaLabels.learnMore.giBillBenefits,
            })}
            name="giBillChapter"
            options={[
              { optionValue: '33', optionLabel: 'Post-9/11 GI Bill (Ch 33)' },
              { optionValue: '33', optionLabel: 'Fry Scholarship (Ch 33)' },
              { optionValue: '30', optionLabel: 'Montgomery GI Bill (Ch 30)' },
              {
                optionValue: '1606',
                optionLabel: 'Select Reserve GI Bill (Ch 1606)',
              },
              {
                optionValue: '31',
                optionLabel: 'Veteran Readiness and Employment (VR&E) (Ch 31)',
              },
              {
                optionValue: '35',
                optionLabel:
                  "Survivors' and Dependents' Educational Assistance (DEA) (Ch 35)",
              },
            ]}
            value={this.props.giBillChapter}
            alt="Which GI Bill benefit do you want to use?"
            visible
            onChange={this.props.eligibilityChange}
            onFocus={this.props.handleInputFocus}
          />
          <div>
            {this.props.militaryStatus === 'active duty' &&
              this.props.giBillChapter === '33' && (
                <div className="military-status-info warning form-group">
                  <i className="fa fa-warning" />
                  <a
                    title="Post 9/11 GI Bill"
                    href="http://www.benefits.va.gov/gibill/post911_gibill.asp"
                    id="anch_378"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Post 9/11 GI Bill
                  </a>{' '}
                  recipients serving on Active Duty (or transferee spouses of a
                  service member on active duty) are not eligible to receive a
                  monthly housing allowance.
                </div>
              )}
            {this.props.giBillChapter === '31' && (
              <div className="military-status-info info form-group">
                <i className="fa fa-info-circle" />
                To apply for VR&E benefits, please{' '}
                <EbenefitsLink path="ebenefits/about/feature?feature=vocational-rehabilitation-and-employment">
                  visit this site
                </EbenefitsLink>
                .
              </div>
            )}
            <Dropdown
              label={this.renderLearnMoreLabel({
                text: 'Cumulative Post-9/11 active-duty service',
                modal: 'cumulativeService',
                ariaLabel: ariaLabels.learnMore.post911Chapter33,
              })}
              name="cumulativeService"
              options={this.cumulativeServiceOptions()}
              value={this.props.cumulativeService}
              alt="Cumulative Post-9/11 active-duty service"
              visible={this.props.giBillChapter === '33'}
              onChange={this.props.eligibilityChange}
              onFocus={this.props.handleInputFocus}
            />
            <Dropdown
              label={this.renderLearnMoreLabel({
                text: 'Completed an enlistment of:',
                modal: 'enlistmentService',
                ariaLabel: ariaLabels.learnMore.montgomeryGIBill,
              })}
              name="enlistmentService"
              options={[
                { optionValue: '3', optionLabel: '3 or more years' },
                { optionValue: '2', optionLabel: '2 or more years' },
              ]}
              value={this.props.enlistmentService}
              alt="Completed an enlistment of:"
              visible={this.props.giBillChapter === '30'}
              onChange={this.props.eligibilityChange}
              onFocus={this.props.handleInputFocus}
            />
            <Dropdown
              label="Are you eligible for the Post-9/11 GI Bill?"
              name="eligForPostGiBill"
              options={[
                { optionValue: 'yes', optionLabel: 'Yes' },
                { optionValue: 'no', optionLabel: 'No' },
              ]}
              value={this.props.eligForPostGiBill}
              alt="Are you eligible for the Post-9/11 GI Bill?"
              visible={this.props.giBillChapter === '31'}
              onChange={this.props.eligibilityChange}
              onFocus={this.props.handleInputFocus}
            />
            <Dropdown
              label="How many dependents do you have?"
              name="numberOfDependents"
              options={[
                { optionValue: '0', optionLabel: '0 Dependents' },
                { optionValue: '1', optionLabel: '1 Dependent' },
                { optionValue: '2', optionLabel: '2 Dependents' },
                { optionValue: '3', optionLabel: '3 Dependents' },
                { optionValue: '4', optionLabel: '4 Dependents' },
                { optionValue: '5', optionLabel: '5 Dependents' },
              ]}
              value={this.props.numberOfDependents}
              alt="How many dependents do you have?"
              visible={
                this.props.giBillChapter === '31' &&
                this.props.eligForPostGiBill === 'no'
              }
              onChange={this.props.eligibilityChange}
              onFocus={this.props.handleInputFocus}
            />
            {this.props.children}
          </div>
        </ExpandingGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="eligibility-form">
        {this.props.showHeader && <h2>Your benefits</h2>}
        {this.renderYourMilitaryDetails()}
      </div>
    );
  }
}

export default BenefitsForm;
