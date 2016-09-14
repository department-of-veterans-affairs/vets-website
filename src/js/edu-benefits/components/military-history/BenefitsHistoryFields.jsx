import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import DateInput from '../../../common/components/form-elements/DateInput';

import { validateIfDirty, validateIfDirtyDateObj, isNotBlank, isValidDateField, isValidDateRange } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class BenefitsHistoryFields extends React.Component {
  render() {
    const isToDateValid = isValidDateRange(
      this.props.data.activeDutyRepayingPeriod.toDate,
      this.props.data.activeDutyRepayingPeriod.fromDate
    );
    return (<fieldset>
      <legend>Benefits History</legend>
      <div className="input-section">
        <p>Select all that apply:</p>
        <ErrorableCheckbox
            label="I am receiving benefits from the US Government as a civilian employee for the same term I am seeking benefits from the VA."
            name="civilianBenefitsAssistance"
            checked={this.props.data.civilianBenefitsAssistance}
            onValueChange={(update) => {this.props.onStateChange('civilianBenefitsAssistance', update);}}/>
        <ErrorableCheckbox
            label="I made contributions (up to $600.00) to increase the amount of my monthly benefits."
            name="additionalContributions"
            checked={this.props.data.additionalContributions}
            onValueChange={(update) => {this.props.onStateChange('additionalContributions', update);}}/>
        <ErrorableCheckbox
            label="I qualify for an Active Duty Kicker (sometimes called a 'college fund')"
            name="activeDutyKicker"
            checked={this.props.data.activeDutyKicker}
            onValueChange={(update) => {this.props.onStateChange('activeDutyKicker', update);}}/>
        <ErrorableCheckbox
            label="I qualify for a Reserve Kicker (sometimes called a 'college fund')"
            name="reserveKicker"
            checked={this.props.data.reserveKicker}
            onValueChange={(update) => {this.props.onStateChange('reserveKicker', update);}}/>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.activeDutyRepaying, isNotBlank) ? '' : 'Please select a response'}
            label="Do you have a period of active duty that the department of defense counts for purposes of repaying an education loan?"
            name="activeDutyRepaying"
            options={yesNo}
            value={this.props.data.activeDutyRepaying}
            onValueChange={(update) => {this.props.onStateChange('activeDutyRepaying', update);}}/>
          {this.props.data.activeDutyRepaying.value === 'Y'
          ? <div>
            <DateInput
                errorMessage="Please provide a response"
                validation={validateIfDirtyDateObj(this.props.data.activeDutyRepayingPeriod.fromDate, isValidDateField)}
                label="Start date"
                name="fromDate"
                day={this.props.data.activeDutyRepayingPeriod.fromDate.day}
                month={this.props.data.activeDutyRepayingPeriod.fromDate.month}
                year={this.props.data.activeDutyRepayingPeriod.fromDate.year}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.fromDate', update);}}/>
            <DateInput
                errorMessage={isToDateValid ? 'End Date must be after Start Date' : 'Please provide a response'}
                validation={validateIfDirtyDateObj(this.props.data.activeDutyRepayingPeriod.toDate, (date) => isValidDateRange(this.props.data.activeDutyRepayingPeriod.fromDate, date))}
                label="End date"
                name="toDate"
                day={this.props.data.activeDutyRepayingPeriod.toDate.day}
                month={this.props.data.activeDutyRepayingPeriod.toDate.month}
                year={this.props.data.activeDutyRepayingPeriod.toDate.year}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.toDate', update);}}/>
          </div>
        : null}
      </div>
    </fieldset>
    );
  }
}

BenefitsHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
