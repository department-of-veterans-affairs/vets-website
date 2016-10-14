import React from 'react';

import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import DateInput from '../../../common/components/form-elements/DateInput';

import { validateIfDirtyDateObj, isValidDateField, isValidDateRange } from '../../utils/validations';

export default class BenefitsHistoryFields extends React.Component {
  render() {
    const isToDateValid = isValidDateRange(
      this.props.data.activeDutyRepayingPeriod.to,
      this.props.data.activeDutyRepayingPeriod.from
    );
    return (<fieldset>
      <legend>Benefits history</legend>
      <div className="input-section">
        <p>Select all that apply:</p>
        <ErrorableCheckbox
            label="I am receiving benefits from the US Government as a civilian employee for the same term I am seeking benefits from VA."
            name="civilianBenefitsAssistance"
            checked={this.props.data.civilianBenefitsAssistance}
            onValueChange={(update) => {this.props.onStateChange('civilianBenefitsAssistance', update);}}/>
        <ErrorableCheckbox
            label="I made contributions (up to $600.00) to increase the amount of my monthly benefits."
            name="additionalContributions"
            checked={this.props.data.additionalContributions}
            onValueChange={(update) => {this.props.onStateChange('additionalContributions', update);}}/>
        <ErrorableCheckbox
            label="I qualify for an Active Duty Kicker (sometimes called a ‘college fund’)."
            name="activeDutyKicker"
            checked={this.props.data.activeDutyKicker}
            onValueChange={(update) => {this.props.onStateChange('activeDutyKicker', update);}}/>
        <ErrorableCheckbox
            label="I qualify for a Reserve Kicker (sometimes called a ‘college fund’)."
            name="reserveKicker"
            checked={this.props.data.reserveKicker}
            onValueChange={(update) => {this.props.onStateChange('reserveKicker', update);}}/>
        <ExpandingGroup
            additionalClass="edu-benefits-active-group"
            open={this.props.data.activeDutyRepaying}>
          <ErrorableCheckbox
              label="I have a period of service that the Department of Defense counts towards an education loan payment."
              name="activeDutyRepaying"
              checked={this.props.data.activeDutyRepaying}
              onValueChange={(update) => {this.props.onStateChange('activeDutyRepaying', update);}}/>
          <div>
            <DateInput required
                errorMessage="Please provide a response"
                validation={validateIfDirtyDateObj(this.props.data.activeDutyRepayingPeriod.from, isValidDateField)}
                label="Start date"
                name="from"
                day={this.props.data.activeDutyRepayingPeriod.from.day}
                month={this.props.data.activeDutyRepayingPeriod.from.month}
                year={this.props.data.activeDutyRepayingPeriod.from.year}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.from', update);}}/>
            <DateInput required
                errorMessage={isToDateValid ? 'End Date must be after Start Date' : 'Please provide a response'}
                validation={validateIfDirtyDateObj(this.props.data.activeDutyRepayingPeriod.to, (date) => isValidDateRange(this.props.data.activeDutyRepayingPeriod.from, date))}
                label="End date"
                name="to"
                day={this.props.data.activeDutyRepayingPeriod.to.day}
                month={this.props.data.activeDutyRepayingPeriod.to.month}
                year={this.props.data.activeDutyRepayingPeriod.to.year}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.to', update);}}/>
          </div>
        </ExpandingGroup>
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
