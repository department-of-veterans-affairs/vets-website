import React from 'react';

import DateInput from '../../common/components/form-elements/DateInput';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';

import { isValidDateRange, isValidDateField, validateIfDirtyDateObj } from '../utils/validations';
import { states } from '../../common/utils/options-for-select';

export default class EducationPeriod extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const period = this.props.data;
    const formFields = (
      <div>
        <ErrorableTextInput
            label="Name of college or other training provider"
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
        <DateInput required
            errorMessage="Please provide a response"
            validation={validateIfDirtyDateObj(period.fromDate, isValidDateField)}
            label="From"
            name="fromDate"
            day={period.fromDate.day}
            month={period.fromDate.month}
            year={period.fromDate.year}
            onValueChange={(update) => {onValueChange('fromDate', update);}}/>
        <DateInput required
            errorMessage={isValidDateRange(period.fromDate, period.toDate) ? 'Please provide a response' : 'Date separated must be after date entered'}
            validation={validateIfDirtyDateObj(period.toDate, date => isValidDateRange(period.fromDate, date))}
            label="To"
            name="toDate"
            day={period.toDate.day}
            month={period.toDate.month}
            year={period.toDate.year}
            onValueChange={(update) => {onValueChange('toDate', update);}}/>
        <ErrorableTextInput
            label="Hours"
            name="hours"
            field={period.hours}
            onValueChange={(update) => {onValueChange('hours', update);}}/>
        <ErrorableRadioButtons
            label="Type of hours"
            name="hoursType"
            value={period.hoursType}
            options={['Semester', 'Quarter', 'Clock']}
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

    return view === 'collapsed' ? (<div>{period.name.value}</div>) : formFields;
  }
}

EducationPeriod.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
