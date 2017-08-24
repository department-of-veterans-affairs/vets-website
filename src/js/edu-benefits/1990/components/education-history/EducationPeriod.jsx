import PropTypes from 'prop-types';
import React from 'react';

import ErrorableMonthYear from '../../../../common/components/form-elements/ErrorableMonthYear';
import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableNumberInput from '../../../../common/components/form-elements/ErrorableNumberInput';
import ErrorableSelect from '../../../../common/components/form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import { isValidPartialMonthYearInPast, isValidPartialMonthYearRange } from '../../../../common/utils/validations';
import { states } from '../../../../common/utils/options-for-select';

import { hoursTypes } from '../../utils/options-for-select';
import EducationPeriodReview from './EducationPeriodReview';

export default class EducationPeriod extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const period = this.props.data;
    const formFields = (
      <div className="input-section">
        <ErrorableTextInput
          label="College, university, or other training provider"
          name="name"
          field={period.name}
          onValueChange={(update) => {onValueChange('name', update);}}/>
        <ErrorableTextInput
          label="City"
          name="city"
          field={period.city}
          onValueChange={(update) => {onValueChange('city', update);}}/>
        <ErrorableSelect
          label="State"
          name="state"
          field={period.state}
          value={period.state}
          options={states.USA}
          onValueChange={(update) => {onValueChange('state', update);}}/>
        <ErrorableMonthYear
          validation={{
            valid: isValidPartialMonthYearInPast(period.dateRange.from.month.value, period.dateRange.from.year.value),
            message: 'Please provide a valid date in the past'
          }}
          label="From"
          name="fromDate"
          date={period.dateRange.from}
          onValueChange={(update) => {onValueChange('dateRange.from', update);}}/>
        <ErrorableMonthYear
          validation={[
            {
              valid: isValidPartialMonthYearInPast(period.dateRange.to.month.value, period.dateRange.to.year.value),
              message: 'Please provide a valid date in the past'
            },
            {
              valid: isValidPartialMonthYearRange(period.dateRange.from, period.dateRange.to),
              message: 'To date must be after From date'
            },
          ]}
          label="To"
          name="toDate"
          date={period.dateRange.to}
          onValueChange={(update) => {onValueChange('dateRange.to', update);}}/>
        <ErrorableNumberInput
          min={0}
          label="Hours completed"
          name="hours"
          field={period.hours}
          onValueChange={(update) => {onValueChange('hours', update);}}/>
        <ErrorableRadioButtons
          label="Type of hours"
          name="hoursType"
          value={period.hoursType}
          options={hoursTypes}
          onValueChange={(update) => {onValueChange('hoursType', update);}}/>
        <ErrorableTextInput
          label="Name of degree, diploma, or certificate"
          name="degreeReceived"
          field={period.degreeReceived}
          onValueChange={(update) => {onValueChange('degreeReceived', update);}}/>
        <ErrorableTextInput
          label="Major or course of study"
          name="major"
          field={period.major}
          onValueChange={(update) => {onValueChange('major', update);}}/>
      </div>
    );

    return view === 'collapsed' ? <EducationPeriodReview period={this.props.data} onEdit={this.props.onEdit}/> : formFields;
  }
}

EducationPeriod.propTypes = {
  data: PropTypes.object.isRequired,
  view: PropTypes.string,
  onValueChange: PropTypes.func.isRequired
};
