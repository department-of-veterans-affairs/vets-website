import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Dropdown from '../Dropdown';
import If from '../If';
import RadioButtons from '../RadioButtons';

export class EligibilityForm extends React.Component {

  render() {
    return (
      <div className="eligibility-form">
        <h2>Your eligibility</h2>

        <RadioButtons
            label="How do you want to take classes?"
            name="online_classes"
            options={[
            { value: 'yes', label: 'Online only' },
            { value: 'no', label: 'In person only' },
            { value: 'both', label: 'In person and online' }
            ]}
            value={this.props.eligibility.online_classes}
            onChange={this.props.handleChange}/>

        <Dropdown
            name="military_status"
            options={[
              { value: 'veteran', label: 'Veteran' },
              { value: 'active duty', label: 'Active Duty' },
              { value: 'national guard / reserves', label: 'National Guard / Reserves' },
              { value: 'spouse', label: 'Spouse' },
              { value: 'child', label: 'Child' }
            ]}
            value={this.props.eligibility.military_status}
            alt="What is your military status?"
            visible={this.props.eligibility.dropdowns.militaryStatus}
            onChange={this.props.handleChange}>
          <label htmlFor="military_status">
            What is your military status?
          </label>
        </Dropdown>

        <Dropdown
            name="spouse_active_duty"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={this.props.eligibility.spouse_active_duty}
            alt="Is your spouse on active duty?"
            visible={this.props.eligibility.dropdowns.spouseActiveDuty}
            onChange={this.props.handleChange}>
          <label htmlFor="spouse_active_duty">
            Is your spouse on active duty?
          </label>
        </Dropdown>

        <Dropdown
            name="gi_bill_chapter"
            options={[
              { value: '33', label: 'Post-9/11 GI Bill (Ch 33)' },
              { value: '30', label: 'Montgomery GI Bill (Ch 30)' },
              { value: '1606', label: 'Select Reserve GI Bill (Ch 1606)' },
              { value: '1607', label: 'REAP GI Bill (Ch 1607)' },
              { value: '31', label: 'Vocational Rehabilitation & Employment (VR & E)' },
              { value: '35', label: 'Dependents Educational Assistance (DEA)' },
            ]}
            value={this.props.eligibility.gi_bill_chapter}
            alt="Which GI Bill benefit do you want to use?"
            visible={this.props.eligibility.dropdowns.giBillChapter}
            onChange={this.props.handleChange}>
          <label htmlFor="gi_bill_chapter">
            Which GI Bill benefit do you want to use?
            (<a onClick={() => this.props.showModal('giBillChapter')} className="info-icons">
              learn more
            </a>)
          </label>
        </Dropdown>

        <If condition={
            this.props.eligibility.military_status === 'active duty' &&
            this.props.eligibility.gi_bill_chapter === '33'}>
          <div className="militaryStatusInfo form-group">
            <i className="fa fa-warning"></i>
            <a title="Post 9/11 GI Bill"
                href="http://www.benefits.va.gov/gibill/post911_gibill.asp"
                id="anch_378" target="_blank">
            Post 9/11 GI Bill</a> recipients serving on Active Duty (or
            transferee spouses of a servicemember on active duty) are not
            eligible to receive a monthly housing allowance.
          </div>
        </If>

        <Dropdown
            name="cumulative_service"
            options={[
              { value: '1.0', label: '36+ months: 100% (includes BASIC)' }, // notice not 1.00
              { value: '0.9', label: '30 months: 90% (includes BASIC)' },
              { value: '0.8', label: '24 months: 80% (includes BASIC)' },
              { value: '0.7', label: '18 months: 70% (excludes BASIC)' },
              { value: '0.6', label: '12 months: 60% (excludes BASIC)' },
              { value: '0.5', label: '6 months: 50% (excludes BASIC)' },
              { value: '0.4', label: '90 days: 40% (excludes BASIC)' },
              { value: '0.0', label: 'Less than 90 days 0% (excludes BASIC)' },
              { value: '1.00', label: 'GYSGT Fry Scholarship: 100%' },  // notice not 1.0
              { value: 'service discharge', label: 'Service-Connected Discharge: 100%' }
            ]}
            value={this.props.eligibility.cumulative_service}
            alt="Cumulative Post-9/11 active duty service"
            visible={this.props.eligibility.dropdowns.cumulativeService}
            onChange={this.props.handleChange}>
          <label htmlFor="cumulative_service">
            Cumulative Post-9/11 active duty service
            (<a onClick={() => this.props.showModal('cumulativeService')} className="info-icons">
              learn more
            </a>)
          </label>
        </Dropdown>

        <Dropdown
            name="enlistment_service"
            options={[
              { value: '3', label: '3 or more years' },
              { value: '2', label: '2 or more years' }
            ]}
            value={this.props.eligibility.enlistment_service}
            alt="Completed an enlistment of:"
            visible={this.props.eligibility.dropdowns.enlistmentService}
            onChange={this.props.handleChange}>
          <label htmlFor="enlistment_service">
            Completed an enlistment of:
            (<a onClick={() => this.props.showModal('enlistmentService')} className="info-icons">
              learn more
            </a>)
          </label>
        </Dropdown>

        <Dropdown
            name="consecutive_service"
            options={[
              { value: '0.8', label: '2+ years of consecutive service: 80%' },
              { value: '0.6', label: '1+ year of consecutive service: 60%' },
              { value: '0.4', label: '90+ days of consecutive service: 40%' }
            ]}
            value={this.props.eligibility.consecutive_service}
            alt="Length of longest active duty tour:"
            visible={this.props.eligibility.dropdowns.consecutiveService}
            onChange={this.props.handleChange}>
          <label htmlFor="consecutive_service">
            Length of longest active duty tour:
            (<a onClick={() => this.props.showModal('consecutiveService')} className="info-icons">
              learn more
            </a>)
          </label>
        </Dropdown>

        <Dropdown
            name="elig_for_post_gi_bill"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
            value={this.props.eligibility.elig_for_post_gi_bill}
            alt="Are you eligible for the Post-9/11 GI Bill?"
            visible={this.props.eligibility.dropdowns.eligForPostGIBill}
            onChange={this.props.handleChange}>
          <label htmlFor="elig_for_post_gi_bill">
            Are you eligible for the Post-9/11 GI Bill?
          </label>
        </Dropdown>

        <Dropdown
            name="number_of_dependents"
            options={[
              { value: '0', label: '0 Dependents' },
              { value: '1', label: '1 Dependent' },
              { value: '2', label: '2 Dependents' },
              { value: '3', label: '3 Dependents' },
              { value: '4', label: '4 Dependents' },
              { value: '5', label: '5 Dependents' }
            ]}
            value={this.props.eligibility.number_of_dependents}
            alt="How many dependents do you have?"
            visible={this.props.eligibility.dropdowns.numberOfDependents}
            onChange={this.props.handleChange}
            showLabel={this.props.labels}>
          <label htmlFor="number_of_dependents">
            How many dependents do you have?
          </label>
        </Dropdown>

      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    },
    handleChange: (e) => {
      dispatch(actions.eligibilityChange(e));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EligibilityForm);
