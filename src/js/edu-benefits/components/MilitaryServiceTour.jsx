import React from 'react';

import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import DateInput from '../../common/components/form-elements/DateInput';

import { validateIfDirty, isNotBlank, isValidDateField } from '../../common/utils/validations';
import { serviceBranches, yesNoNA } from '../utils/options-for-select';

export default class MilitaryServiceTour extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const tour = this.props.data;
    const formFields = (
      <div>
        <div className="usa-alert usa-alert-info">
          <ErrorableCheckbox
              label="Do not apply this period of service to my selected benefit."
              name="doNotApplyPeriodToSelected"
              checked={tour.doNotApplyPeriodToSelected}
              onValueChange={(update) => {onValueChange('doNotApplyPeriodToSelected', update);}}/>
            {tour.doNotApplyPeriodToSelected
              ? <div>
                <p>Which benefit should this period of service be applied to?</p>
                <ErrorableCheckbox
                    label="Chapter 30"
                    name="applyToChapter30"
                    checked={tour.applyToChapter30}
                    onValueChange={(update) => {onValueChange('applyToChapter30', update);}}/>
                <ErrorableCheckbox
                    label="Chapter 1606"
                    name="applyToChapter1606"
                    checked={tour.applyToChapter1606}
                    onValueChange={(update) => {onValueChange('applyToChapter1606', update);}}/>
                <ErrorableCheckbox
                    label="Chapter 32 / Section 903"
                    name="applyToChapter32"
                    checked={tour.applyToChapter32}
                    onValueChange={(update) => {onValueChange('applyToChapter32', update);}}/>
              </div>
              : null
            }
        </div>
        <ErrorableSelect required
            errorMessage={validateIfDirty(tour.serviceBranch, isNotBlank) ? undefined : 'Please select a service branch'}
            label="Branch of service"
            name="serviceBranch"
            options={serviceBranches}
            value={tour.serviceBranch}
            onValueChange={(update) => {onValueChange('serviceBranch', update);}}/>
        <DateInput required
            errorMessage="Entry date must be greater than 15 years of age"
            validation={validateIfDirty(tour.dateRange.fromDate, isValidDateField)}
            label="Date entered"
            name="fromDate"
            day={tour.dateRange.fromDate.day}
            month={tour.dateRange.fromDate.month}
            year={tour.dateRange.fromDate.year}
            onValueChange={(update) => {onValueChange('dateRange.fromDate', update);}}/>
        <DateInput required
            errorMessage="Entry date must be greater than 15 years of age"
            validation={validateIfDirty(tour.dateRange.toDate, isValidDateField)}
            label="Date separated"
            name="toDate"
            day={tour.dateRange.toDate.day}
            month={tour.dateRange.toDate.month}
            year={tour.dateRange.toDate.year}
            onValueChange={(update) => {onValueChange('dateRange.toDate', update);}}/>
        <ErrorableTextInput
            label="Service Status"
            name="serviceStatus"
            field={tour.serviceStatus}
            onValueChange={(update) => {onValueChange('serviceStatus', update);}}/>
        <ErrorableRadioButtons
            label="Were you involuntarily called for active duty during this period?"
            name="involuntarilyCalledToDuty"
            options={yesNoNA}
            value={tour.involuntarilyCalledToDuty}
            onValueChange={(update) => {onValueChange('involuntarilyCalledToDuty', update);}}/>
      </div>
    );

    return view === 'collapsed' ? (<div>{tour.serviceBranch.value}</div>) : formFields;
  }
}

MilitaryServiceTour.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
