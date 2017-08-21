import PropTypes from 'prop-types';
import React from 'react';

import ErrorableCheckbox from '../../../../common/components/form-elements/ErrorableCheckbox';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';
import ErrorableCurrentOrPastDate from '../../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import { isValidDateRange } from '../../../../common/utils/validations';

export default class ContributionsFields extends React.Component {
  render() {
    const relinquished = this.props.data.benefitsRelinquished.value;
    return (<fieldset>
      <legend>Contributions</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <p>Select all that apply:</p>
        <ErrorableCheckbox
            label="I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA."
            name="civilianBenefitsAssistance"
            checked={this.props.data.civilianBenefitsAssistance}
            onValueChange={(update) => {this.props.onStateChange('civilianBenefitsAssistance', update);}}/>
        <ErrorableCheckbox
            label="I made contributions (up to $600) to increase the amount of my monthly benefits."
            name="additionalContributions"
            checked={this.props.data.additionalContributions}
            onValueChange={(update) => {this.props.onStateChange('additionalContributions', update);}}/>
        <ExpandingGroup
            additionalClass="edu-benefits-active-group"
            open={this.props.data.activeDutyKicker && relinquished === 'chapter1606'}>
          <ErrorableCheckbox
              label="I qualify for an Active Duty Kicker (sometimes called a college fund)."
              name="activeDutyKicker"
              checked={this.props.data.activeDutyKicker}
              onValueChange={(update) => {this.props.onStateChange('activeDutyKicker', update);}}/>
          <div className="usa-alert usa-alert-warning usa-content secondary">
            <div className="usa-alert-body">
              <span>You can only transfer a kicker from a benefit that you relinquish (give up). You chose to relinquish <strong>MGIB-SR</strong> so you won’t get your Active Duty kicker.</span>
            </div>
          </div>
        </ExpandingGroup>
        <ExpandingGroup
            additionalClass="edu-benefits-active-group"
            open={this.props.data.reserveKicker && relinquished === 'chapter30'}>
          <ErrorableCheckbox
              label="I qualify for a Reserve Kicker (sometimes called a college fund)."
              name="reserveKicker"
              checked={this.props.data.reserveKicker}
              onValueChange={(update) => {this.props.onStateChange('reserveKicker', update);}}/>
          <div className="usa-alert usa-alert-warning usa-content secondary">
            <div className="usa-alert-body">
              <span>You can only transfer a kicker from a benefit that you relinquish (give up). You chose to relinquish <strong>MGIB-AD</strong> so you won’t get your Active Duty kicker.</span>
            </div>
          </div>
        </ExpandingGroup>
        <ExpandingGroup
            additionalClass="edu-benefits-active-group"
            open={this.props.data.activeDutyRepaying}>
          <ErrorableCheckbox
              label="I have a period of service that the Department of Defense counts toward an education loan payment."
              name="activeDutyRepaying"
              checked={this.props.data.activeDutyRepaying}
              onValueChange={(update) => {this.props.onStateChange('activeDutyRepaying', update);}}/>
          <div>
            <ErrorableCurrentOrPastDate required
                label="Start date"
                name="from"
                date={this.props.data.activeDutyRepayingPeriod.from}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.from', update);}}/>
            <ErrorableCurrentOrPastDate required
                validation={{
                  valid: isValidDateRange(this.props.data.activeDutyRepayingPeriod.from, this.props.data.activeDutyRepayingPeriod.to),
                  message: 'End date must be after start date'
                }}
                label="End date"
                name="to"
                date={this.props.data.activeDutyRepayingPeriod.to}
                onValueChange={(update) => {this.props.onStateChange('activeDutyRepayingPeriod.to', update);}}/>
          </div>
        </ExpandingGroup>
      </div>
    </fieldset>
    );
  }
}

ContributionsFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
