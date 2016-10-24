import React from 'react';

import DateInput from '../../../common/components/form-elements/DateInput';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { isValidDateRange, isValidDateField, validateIfDirtyDateObj } from '../../utils/validations';
import { states, hoursTypes } from '../../utils/options-for-select';
import { displayDateIfValid } from '../../utils/helpers';

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
        <DateInput
            errorMessage="Please provide a valid date in the past"
            validation={validateIfDirtyDateObj(period.dateRange.from, isValidDateField)}
            label="From"
            name="fromDate"
            day={period.dateRange.from.day}
            month={period.dateRange.from.month}
            year={period.dateRange.from.year}
            onValueChange={(update) => {onValueChange('dateRange.from', update);}}/>
        <DateInput
            errorMessage={isValidDateRange(period.dateRange.from, period.dateRange.to) ? 'Please provide a response' : 'Date separated must be after date entered'}
            validation={validateIfDirtyDateObj(period.dateRange.to, date => isValidDateRange(period.dateRange.from, date))}
            label="To"
            name="toDate"
            day={period.dateRange.to.day}
            month={period.dateRange.to.month}
            year={period.dateRange.to.year}
            onValueChange={(update) => {onValueChange('dateRange.to', update);}}/>
        <ErrorableTextInput
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
            label="Degree, diploma or certificate received"
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

    let reviewFields;
    if (period.name.value) {
      reviewFields = (
        <div>
          <div><strong>{period.name.value}</strong></div>
          <div>{displayDateIfValid(period.dateRange.from)} &mdash; {displayDateIfValid(period.dateRange.to)}</div>
        </div>
      );
    } else {
      reviewFields = (<div>This entry may be missing information</div>);
    }

    return view === 'collapsed' ? reviewFields : formFields;
  }
}

EducationPeriod.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
