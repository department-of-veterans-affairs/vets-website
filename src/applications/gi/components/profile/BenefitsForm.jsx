import React from 'react';
import PropTypes from 'prop-types';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';

export class BenefitsForm extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    hideModal: PropTypes.func,
    eligibilityChange: PropTypes.func,
    showHeader: PropTypes.bool,
  };

  static defaultProps = {
    showGbBenefit: false,
    showHeader: false,
  };

  cumulativeServiceOptions = () => [
    { value: '1.0', label: '36+ months: 100% (includes BASIC)' }, // notice not 1.00
    { value: '0.9', label: '30 months: 90% (includes BASIC)' },
    { value: '0.8', label: '24 months: 80% (includes BASIC)' },
    { value: '0.7', label: '18 months: 70% (excludes BASIC)' },
    { value: '0.6', label: '12 months: 60% (excludes BASIC)' },
    { value: '0.5', label: '6 months: 50% (excludes BASIC)' },
    { value: '0.4', label: '90 days: 40% (excludes BASIC)' },
    { value: '0.0', label: 'Less than 90 days 0% (excludes BASIC)' },
    { value: '1.00', label: 'GYSGT Fry Scholarship: 100%' }, // notice not 1.0
    {
      value: 'service discharge',
      label: 'Service-Connected Discharge: 100%',
    },
    { value: 'purple heart', label: 'Purple Heart Service: 100%' },
  ];

  renderLearnMoreLabel = ({ text, modal, ariaLabel }) =>
    renderLearnMoreLabel({
      text,
      modal,
      ariaLabel,
      showModal: this.props.showModal,
      component: this,
    });

  render() {
    return (
      <div className="eligibility-form">
        {this.props.showHeader && <h2>Your benefits</h2>}
        <Dropdown
          label="What's your military status?"
          name="militaryStatus"
          options={[
            { value: 'veteran', label: 'Veteran' },
            { value: 'active duty', label: 'Active Duty' },
            {
              value: 'national guard / reserves',
              label: 'National Guard / Reserves',
            },
            { value: 'spouse', label: 'Spouse' },
            { value: 'child', label: 'Child' },
          ]}
          value={this.props.militaryStatus}
          alt="What's your military status?"
          visible
          onChange={this.props.eligibilityChange}
        />
        <Dropdown
          label="Is your spouse on active duty?"
          name="spouseActiveDuty"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.spouseActiveDuty}
          alt="Is your spouse on active duty?"
          visible={this.props.militaryStatus === 'spouse'}
          onChange={this.props.eligibilityChange}
        />
        <Dropdown
          label={this.renderLearnMoreLabel({
            text: 'Which GI Bill benefit do you want to use?',
            modal: 'giBillChapter',
            ariaLabel: ariaLabels.learnMore.giBillBenefits,
          })}
          name="giBillChapter"
          options={[
            { value: '33', label: 'Post-9/11 GI Bill (Ch 33)' },
            { value: '30', label: 'Montgomery GI Bill (Ch 30)' },
            { value: '1606', label: 'Select Reserve GI Bill (Ch 1606)' },
            {
              value: '31',
              label: 'Vocational Rehabilitation & Employment (VR & E)',
            },
            {
              value: '35',
              label: 'Dependents Educational Assistance (DEA)',
            },
          ]}
          value={this.props.giBillChapter}
          alt="Which GI Bill benefit do you want to use?"
          visible
          onChange={this.props.eligibilityChange}
        />
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
              servicemember on active duty) are not eligible to receive a
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
        />
        <Dropdown
          label={this.renderLearnMoreLabel({
            text: 'Completed an enlistment of:',
            modal: 'enlistmentService',
            ariaLabel: ariaLabels.learnMore.montgomeryGIBill,
          })}
          name="enlistmentService"
          options={[
            { value: '3', label: '3 or more years' },
            { value: '2', label: '2 or more years' },
          ]}
          value={this.props.enlistmentService}
          alt="Completed an enlistment of:"
          visible={this.props.giBillChapter === '30'}
          onChange={this.props.eligibilityChange}
        />
        <Dropdown
          label="Are you eligible for the Post-9/11 GI Bill?"
          name="eligForPostGiBill"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.eligForPostGiBill}
          alt="Are you eligible for the Post-9/11 GI Bill?"
          visible={this.props.giBillChapter === '31'}
          onChange={this.props.eligibilityChange}
        />
        <Dropdown
          label="How many dependents do you have?"
          name="numberOfDependents"
          options={[
            { value: '0', label: '0 Dependents' },
            { value: '1', label: '1 Dependent' },
            { value: '2', label: '2 Dependents' },
            { value: '3', label: '3 Dependents' },
            { value: '4', label: '4 Dependents' },
            { value: '5', label: '5 Dependents' },
          ]}
          value={this.props.numberOfDependents}
          alt="How many dependents do you have?"
          visible={
            this.props.giBillChapter === '31' &&
            this.props.eligForPostGiBill === 'no'
          }
          onChange={this.props.eligibilityChange}
        />
        {this.props.children}
      </div>
    );
  }
}

export default BenefitsForm;
